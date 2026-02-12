# RAG System Integration Guide
**Last Updated:** February 13, 2026  
**System Version:** 2.0 (BGE-base with Class Filtering)

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Embedding Model Configuration](#embedding-model-configuration)
- [Pinecone Vector Database Setup](#pinecone-vector-database-setup)
- [Data Structure & Metadata](#data-structure--metadata)
- [Class Normalization System](#class-normalization-system)
- [Query Processing Pipeline](#query-processing-pipeline)
- [Search & Retrieval Implementation](#search--retrieval-implementation)
- [Response Format](#response-format)
- [API Endpoints Reference](#api-endpoints-reference)
- [Code Examples](#code-examples)
- [Migration Notes](#migration-notes)

---

## 🎯 System Overview

This RAG (Retrieval-Augmented Generation) system is designed for educational content retrieval with **class-specific filtering** support. The system indexes NCERT content across 4 subjects with normalized class labels.

### Key Components:
- **Embedding Model:** BAAI/bge-base-en-v1.5 (local, 768-dimensional)
- **Vector Database:** Pinecone Serverless (AWS us-east-1)
- **LLM Provider:** Groq (llama-3.1-8b-instant)
- **Total Indexed Records:** 3,162 educational content chunks
- **Supported Classes:** 6, 7, 8, 9, 10, 11, 12

---

## 🤖 Embedding Model Configuration

### Current Model: BAAI/bge-base-en-v1.5

```python
# Model Details
MODEL_NAME = "BAAI/bge-base-en-v1.5"
EMBEDDING_DIMENSION = 768
PROVIDER = "local"  # Using SentenceTransformer, not OpenAI
```

### Why BGE-base?
- **Higher Quality:** 768-dimensional embeddings vs 384-dim from previous MiniLM model
- **Better Retrieval:** Improved semantic search accuracy
- **Cost-Free:** No API costs (runs locally)
- **Model Size:** 438MB download

### Loading the Model

```python
from sentence_transformers import SentenceTransformer

# Initialize model
model = SentenceTransformer('BAAI/bge-base-en-v1.5')

# Generate embeddings
texts = ["Your query text here"]
embeddings = model.encode(texts, normalize_embeddings=True)
# Returns: numpy array of shape (1, 768)
```

### Important Notes:
- **Normalization Required:** Always use `normalize_embeddings=True`
- **Batch Processing:** Use batch size of 32-64 for optimal performance
- **Device:** Model automatically uses GPU if available, otherwise CPU

---

## 🗄️ Pinecone Vector Database Setup

### Index Configuration

```python
# Pinecone Index Details
INDEX_NAME = "ncert-local-bge-base"
DIMENSION = 768
METRIC = "cosine"
CLOUD = "aws"
REGION = "us-east-1"
```

### Index Creation (Already Done)

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="your_pinecone_api_key")

# Index already exists, but for reference:
pc.create_index(
    name="ncert-local-bge-base",
    dimension=768,
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)
```

### Namespace Structure

The index uses **namespaces** to organize content by subject:

| Namespace | Subject | Records |
|-----------|---------|---------|
| `economics` | Economics | 763 |
| `geography` | Geography | 692 |
| `history` | History | 741 |
| `polity` | Polity | 966 |

### Important Namespace Rules:
1. **Always search across ALL namespaces** unless user specifies a specific subject
2. **Search order doesn't matter** - aggregate results from all namespaces
3. **Namespace names are lowercase** - use exact strings: `economics`, `geography`, `history`, `polity`

---

## 📊 Data Structure & Metadata

### Complete Metadata Schema

Each vector in Pinecone has the following metadata structure:

```python
{
    # Core Content
    "content": "The actual text content from NCERT book...",
    "source": "NCERT-Economics-Class-10",
    
    # Hierarchical Structure
    "subject": "Economics",          # Economics, Geography, History, Polity
    "chapter": "Chapter 1: Introduction",
    "topic": "Basic Economic Concepts",
    
    # Class Information (CRITICAL - 4 fields)
    "class_raw": "10th",            # Original value from source data
    "class": "Class 10",            # Display-friendly format
    "class_num": 10,                # Integer for sorting/filtering
    "class_normalized": "class-10", # Standardized filter key (USE THIS FOR FILTERING)
    
    # Additional Fields (may vary by record)
    "page": "15",
    "section": "1.2",
    "keywords": ["economy", "production"],
    # ... other custom fields from source JSON
}
```

### Metadata Field Descriptions

| Field | Type | Description | Example | Required |
|-------|------|-------------|---------|----------|
| `content` | string | Full text content | "Democracy is a form of..." | ✅ Yes |
| `source` | string | Source identifier | "NCERT-Polity-Class-9" | ✅ Yes |
| `subject` | string | Subject name | "Polity" | ✅ Yes |
| `class` | string | Display format | "Class 10" | ✅ Yes |
| `class_num` | integer | Numeric class | 10 | ✅ Yes |
| `class_normalized` | string | Filter key | "class-10" | ✅ Yes (for filtering) |
| `class_raw` | string | Original value | "10th", "X", "10TH" | ⚠️ Historical |
| `chapter` | string | Chapter name | "Chapter 3: Agriculture" | ⚠️ Optional |
| `topic` | string | Topic/section | "Types of Farming" | ⚠️ Optional |

---

## 🏷️ Class Normalization System

### Supported Class Labels

The system normalizes 24+ variant formats into 7 canonical classes:

| Canonical Format | `class_normalized` | `class_num` | Accepted Input Variants |
|------------------|-------------------|-------------|------------------------|
| Class 6 | `class-6` | 6 | "6", "6th", "VI", "Class 6", "CLASS – 6TH" |
| Class 7 | `class-7` | 7 | "7", "7th", "VII", "Class 7", "Class VII" |
| Class 8 | `class-8` | 8 | "8", "8th", "VIII", "Class 8", "Class VIII" |
| Class 9 | `class-9` | 9 | "9", "9th", "IX", "Class IX", "CLASS – 9TH" |
| Class 10 | `class-10` | 10 | "10", "10th", "X", "Class 10", "Class X" |
| Class 11 | `class-11` | 11 | "11", "11th", "XI", "Class 11", "Class XI" |
| Class 12 | `class-12` | 12 | "12", "12th", "XII", "Class 12", "Class XII" |

### Normalization Function (Python)

**Use this function to normalize user input:**

```python
import re

def normalize_class_label(class_label):
    """
    Normalize class label to standard format.
    
    Args:
        class_label: Raw class label (string or int)
        
    Returns:
        tuple: (class_num: int, class_display: str, class_normalized: str)
        Example: (10, "Class 10", "class-10")
    """
    if not class_label:
        return None, None, None
    
    class_str = str(class_label).strip().upper()
    
    # Roman numeral mapping
    roman_to_num = {
        'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9,
        'X': 10, 'XI': 11, 'XII': 12
    }
    
    # Check for Roman numerals
    for roman, num in roman_to_num.items():
        if roman in class_str:
            return num, f"Class {num}", f"class-{num}"
    
    # Extract digit with optional ordinal suffix (6th, 10TH, etc.)
    digit_match = re.search(r"\b(6|7|8|9|10|11|12)\s*(?:ST|ND|RD|TH)?\b", class_str)
    if digit_match:
        class_num = int(digit_match.group(1))
        return class_num, f"Class {class_num}", f"class-{class_num}"
    
    return None, None, None

# Example Usage:
normalize_class_label("10th")        # (10, "Class 10", "class-10")
normalize_class_label("Class IX")    # (9, "Class 9", "class-9")
normalize_class_label("CLASS – 6TH") # (6, "Class 6", "class-6")
```

### Class Filter Options API

**Endpoint to get available classes:**

```python
# GET /api/class-options
# Response:
{
    "classes": [
        {"value": "class-6", "label": "Class 6"},
        {"value": "class-7", "label": "Class 7"},
        {"value": "class-8", "label": "Class 8"},
        {"value": "class-9", "label": "Class 9"},
        {"value": "class-10", "label": "Class 10"},
        {"value": "class-11", "label": "Class 11"},
        {"value": "class-12", "label": "Class 12"}
    ]
}
```

---

## 🔍 Query Processing Pipeline

### Step-by-Step Query Flow

```
User Input → Class Extraction → Query Embedding → Multi-Namespace Search → Filter by Class → Rank Results → Generate Answer
```

### 1. Extract Class Filter from Query

```python
def extract_class_filter(user_query: str) -> str | None:
    """
    Extract class filter from user query.
    
    Examples:
        "What is photosynthesis in class 10?" → "class-10"
        "Class 9 geography question" → "class-9"
        "Tell me about democracy" → None
    """
    query_lower = user_query.lower()
    
    # Check for explicit class mentions
    class_patterns = [
        r"class\s*(\d+)",
        r"std\s*(\d+)",
        r"grade\s*(\d+)",
        r"(\d+)(?:st|nd|rd|th)\s*class",
    ]
    
    for pattern in class_patterns:
        match = re.search(pattern, query_lower)
        if match:
            class_num = int(match.group(1))
            if 6 <= class_num <= 12:
                return f"class-{class_num}"
    
    return None
```

### 2. Generate Query Embedding

```python
def embed_query(query: str, model: SentenceTransformer) -> list:
    """
    Generate embedding for user query.
    
    Args:
        query: User's question text
        model: Pre-loaded SentenceTransformer model
        
    Returns:
        List of 768 float values
    """
    embedding = model.encode(
        [query],
        normalize_embeddings=True,
        show_progress_bar=False
    )
    return embedding[0].tolist()  # Convert numpy to list
```

### 3. Search Across Namespaces

**CRITICAL: Generate embedding ONCE and reuse for all namespaces**

```python
def search_all_namespaces(
    index,
    query_embedding: list,
    top_k: int = 10,
    class_filter: str | None = None
) -> list:
    """
    Search across all subject namespaces with optional class filtering.
    
    Args:
        index: Pinecone index object
        query_embedding: Pre-computed 768-dim embedding vector
        top_k: Number of results to retrieve per namespace
        class_filter: Normalized class (e.g., "class-10") or None
        
    Returns:
        List of dicts with score, metadata, namespace
    """
    namespaces = ["economics", "geography", "history", "polity"]
    all_results = []
    
    for namespace in namespaces:
        # Build filter if class is specified
        filter_dict = None
        if class_filter:
            filter_dict = {"class_normalized": {"$eq": class_filter}}
        
        # Query this namespace
        response = index.query(
            vector=query_embedding,  # REUSE same embedding
            top_k=top_k,
            namespace=namespace,
            include_metadata=True,
            filter=filter_dict  # Apply class filter
        )
        
        # Collect matches
        for match in response.matches:
            all_results.append({
                "score": match.score,
                "metadata": match.metadata,
                "namespace": namespace,
                "id": match.id
            })
    
    # Sort by relevance score (descending)
    all_results.sort(key=lambda x: x["score"], reverse=True)
    
    # Return top results across all namespaces
    return all_results[:top_k]
```

---

## 🔎 Search & Retrieval Implementation

### Complete Search Function

```python
def semantic_search(
    query: str,
    model: SentenceTransformer,
    index,
    top_k: int = 5,
    selected_class: str | None = None,
    score_threshold: float = 0.3
) -> dict:
    """
    Complete semantic search with class filtering.
    
    Args:
        query: User question
        model: BGE-base model
        index: Pinecone index
        top_k: Number of results
        selected_class: Class filter (e.g., "class-10") or None
        score_threshold: Minimum relevance score
        
    Returns:
        Dict with results and metadata
    """
    # 1. Generate embedding ONCE
    query_embedding = embed_query(query, model)
    
    # 2. Extract class from query if not explicitly provided
    if not selected_class:
        selected_class = extract_class_filter(query)
    
    # 3. Search all namespaces
    results = search_all_namespaces(
        index=index,
        query_embedding=query_embedding,
        top_k=top_k * 4,  # Get more, then filter
        class_filter=selected_class
    )
    
    # 4. Filter by score threshold
    filtered_results = [
        r for r in results
        if r["score"] >= score_threshold
    ]
    
    # 5. Limit to top_k
    final_results = filtered_results[:top_k]
    
    return {
        "query": query,
        "class_filter": selected_class,
        "results": final_results,
        "total_found": len(final_results)
    }
```

### Pinecone Filter Syntax

**For class filtering, use this exact syntax:**

```python
# Correct ✅
filter_dict = {"class_normalized": {"$eq": "class-10"}}

# Also works ✅
filter_dict = {"class_normalized": "class-10"}

# Wrong ❌ (don't use class_num for filtering)
filter_dict = {"class_num": 10}  # May not work reliably

# Wrong ❌ (don't use display format)
filter_dict = {"class": "Class 10"}
```

**Why use `class_normalized`?**
- Consistent format (`class-6` through `class-12`)
- Indexed specifically for filtering
- Works reliably with Pinecone metadata filtering

---

## 📤 Response Format

### Search Response Structure

```python
{
    "query": "What is photosynthesis?",
    "class_filter": "class-10",  # null if no filter
    "total_found": 5,
    "results": [
        {
            "score": 0.87,  # Relevance score (0-1)
            "namespace": "geography",
            "id": "geography_json_123",
            "metadata": {
                "content": "Photosynthesis is the process...",
                "subject": "Geography",
                "class": "Class 10",
                "class_num": 10,
                "class_normalized": "class-10",
                "chapter": "Chapter 2: Natural Resources",
                "topic": "Plant Processes",
                "source": "NCERT-Geography-Class-10",
                # ... other fields
            }
        },
        # ... more results
    ]
}
```

### Source Display Format

**For frontend display, structure sources like this:**

```javascript
// Source component props
{
  subject: "Geography",           // Badge color: green (#BAFF39)
  class: "Class 10",             // Badge color: gray
  chapter: "Chapter 2: ...",     // Badge color: gray
  topic: "Plant Processes",      // Badge color: gray
  score: 0.87,                   // Display as "87% match"
  content: "Full text here...",  // Exact source text
  paraphrased: "Simplified..."   // Optional: LLM-paraphrased version
}
```

---

## 🌐 API Endpoints Reference

### Required Endpoints

#### 1. Search Endpoint

```http
POST /api/search
Content-Type: application/json

{
  "query": "What is democracy?",
  "selected_class": "class-9",  // Optional
  "top_k": 5                    // Optional, default: 5
}
```

**Response:**
```json
{
  "success": true,
  "query": "What is democracy?",
  "class_filter": "class-9",
  "results": [...],
  "total_found": 5
}
```

#### 2. Class Options Endpoint

```http
GET /api/class-options
```

**Response:**
```json
{
  "classes": [
    {"value": "class-6", "label": "Class 6"},
    {"value": "class-7", "label": "Class 7"},
    // ... class-12
  ]
}
```

#### 3. Chat/Generate Endpoint

```http
POST /api/chat
Content-Type: application/json

{
  "query": "Explain photosynthesis",
  "selected_class": "class-10",
  "conversation_history": []  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Photosynthesis is...",
  "sources": [
    {
      "content": "...",
      "metadata": {...},
      "score": 0.87
    }
  ],
  "class_filter": "class-10"
}
```

---

## 💻 Code Examples

### Complete Backend Implementation

```python
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone

# Load environment
load_dotenv()

# Initialize model (DO ONCE at startup)
print("Loading BGE-base model...")
embedding_model = SentenceTransformer('BAAI/bge-base-en-v1.5')
print("✅ Model loaded")

# Initialize Pinecone (DO ONCE at startup)
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index = pc.Index('ncert-local-bge-base')
print("✅ Pinecone connected")

def normalize_class_label(class_label):
    """Normalize class label to class-N format."""
    if not class_label:
        return None, None, None
    
    import re
    class_str = str(class_label).strip().upper()
    
    roman_to_num = {
        'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9,
        'X': 10, 'XI': 11, 'XII': 12
    }
    
    for roman, num in roman_to_num.items():
        if roman in class_str:
            return num, f"Class {num}", f"class-{num}"
    
    digit_match = re.search(r"\b(6|7|8|9|10|11|12)\s*(?:ST|ND|RD|TH)?\b", class_str)
    if digit_match:
        class_num = int(digit_match.group(1))
        return class_num, f"Class {class_num}", f"class-{class_num}"
    
    return None, None, None

def embed_query(query: str) -> list:
    """Generate 768-dim embedding for query."""
    embedding = embedding_model.encode(
        [query],
        normalize_embeddings=True,
        show_progress_bar=False
    )
    return embedding[0].tolist()

def search_with_class_filter(
    query: str,
    selected_class: str = None,
    top_k: int = 5
) -> dict:
    """
    Search with optional class filtering.
    
    Args:
        query: User question
        selected_class: "class-6" through "class-12" or None
        top_k: Number of results
        
    Returns:
        Search results with metadata
    """
    # Generate embedding
    query_embedding = embed_query(query)
    
    # Namespaces to search
    namespaces = ["economics", "geography", "history", "polity"]
    
    # Build filter
    filter_dict = None
    if selected_class:
        filter_dict = {"class_normalized": {"$eq": selected_class}}
    
    # Search all namespaces
    all_results = []
    for ns in namespaces:
        response = index.query(
            vector=query_embedding,
            top_k=top_k * 2,  # Get extra, then rank
            namespace=ns,
            include_metadata=True,
            filter=filter_dict
        )
        
        for match in response.matches:
            all_results.append({
                "score": match.score,
                "content": match.metadata.get("content", ""),
                "subject": match.metadata.get("subject", ""),
                "class": match.metadata.get("class", ""),
                "chapter": match.metadata.get("chapter", ""),
                "metadata": match.metadata,
                "namespace": ns
            })
    
    # Sort and limit
    all_results.sort(key=lambda x: x["score"], reverse=True)
    final_results = all_results[:top_k]
    
    return {
        "query": query,
        "class_filter": selected_class,
        "results": final_results,
        "total_found": len(final_results)
    }

# Example usage
if __name__ == "__main__":
    # Search without class filter
    result1 = search_with_class_filter("What is democracy?")
    print(f"Found {result1['total_found']} results")
    
    # Search with class filter
    result2 = search_with_class_filter(
        query="What is photosynthesis?",
        selected_class="class-10"
    )
    print(f"Found {result2['total_found']} Class 10 results")
```

### Flask API Example

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize model and index (as shown above)
# ... embedding_model, index initialized ...

@app.route('/api/class-options', methods=['GET'])
def get_class_options():
    """Return available class filters."""
    return jsonify({
        "classes": [
            {"value": "class-6", "label": "Class 6"},
            {"value": "class-7", "label": "Class 7"},
            {"value": "class-8", "label": "Class 8"},
            {"value": "class-9", "label": "Class 9"},
            {"value": "class-10", "label": "Class 10"},
            {"value": "class-11", "label": "Class 11"},
            {"value": "class-12", "label": "Class 12"},
        ]
    })

@app.route('/api/search', methods=['POST'])
def search():
    """Search endpoint with class filtering."""
    data = request.json
    query = data.get('query', '')
    selected_class = data.get('selected_class')
    top_k = data.get('top_k', 5)
    
    if not query:
        return jsonify({"error": "Query required"}), 400
    
    results = search_with_class_filter(query, selected_class, top_k)
    return jsonify({
        "success": True,
        **results
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## 🔄 Migration Notes

### Changes from Previous System

| Component | Old System | New System | Impact |
|-----------|-----------|------------|--------|
| **Embedding Model** | all-MiniLM-L6-v2 | BAAI/bge-base-en-v1.5 | ⚠️ **BREAKING** - Must regenerate embeddings |
| **Embedding Dimension** | 384 | 768 | ⚠️ **BREAKING** - Must use new index |
| **Index Name** | `ncert` | `ncert-local-bge-base` | ⚠️ **BREAKING** - Update index reference |
| **Class Metadata** | Variable formats | Normalized + 4 fields | ✅ Compatible with filtering |
| **Class Filtering** | Not supported | Fully supported | ✅ New feature |
| **Batch Size** | 500 | 100 | ⚠️ Internal change only |

### Breaking Changes Checklist

If migrating from old system, update:

- [ ] **Model Loading**: Change to `BAAI/bge-base-en-v1.5`
- [ ] **Index Name**: Change to `ncert-local-bge-base`
- [ ] **Embedding Dimension**: Update to 768
- [ ] **Query Embedding**: Ensure normalization enabled
- [ ] **Class Filtering**: Use `class_normalized` field
- [ ] **Metadata Access**: Add support for 4 class fields

### Environment Variables

**Required .env variables:**

```bash
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
RAG_INDEX_NAME=ncert-local-bge-base
RAG_INDEX_DIMENSION=768

# Embedding Configuration
EMBEDDING_PROVIDER=local
LOCAL_EMBEDDING_MODEL=BAAI/bge-base-en-v1.5

# LLM Configuration (for answer generation)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL_NAME=llama-3.1-8b-instant
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
pip install sentence-transformers pinecone-client python-dotenv
```

### Step 2: Configure Environment

Create `.env` file:
```bash
PINECONE_API_KEY=your_key_here
RAG_INDEX_NAME=ncert-local-bge-base
RAG_INDEX_DIMENSION=768
EMBEDDING_PROVIDER=local
LOCAL_EMBEDDING_MODEL=BAAI/bge-base-en-v1.5
```

### Step 3: Initialize in Your Code

```python
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
import os

# Load model
model = SentenceTransformer('BAAI/bge-base-en-v1.5')

# Connect to Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index = pc.Index('ncert-local-bge-base')
```

### Step 4: Query the System

```python
# Example 1: No class filter
query = "What is photosynthesis?"
embedding = model.encode([query], normalize_embeddings=True)[0].tolist()

results = index.query(
    vector=embedding,
    top_k=5,
    namespace="geography",
    include_metadata=True
)

# Example 2: With class filter
results = index.query(
    vector=embedding,
    top_k=5,
    namespace="geography",
    include_metadata=True,
    filter={"class_normalized": "class-10"}
)
```

---

## ⚠️ Important Warnings

### DO NOT:
1. ❌ Mix old (384-dim) and new (768-dim) embeddings
2. ❌ Use old index `ncert` with new model
3. ❌ Filter by `class` or `class_num` fields (use `class_normalized`)
4. ❌ Generate embeddings without `normalize_embeddings=True`
5. ❌ Embed query multiple times for same search (reuse embedding)

### DO:
1. ✅ Always use `class_normalized` for filtering
2. ✅ Search all namespaces for comprehensive results
3. ✅ Cache the model at startup (don't reload per request)
4. ✅ Normalize user class input before filtering
5. ✅ Use score threshold (>0.3 recommended) to filter low-quality matches

---

## 📊 Performance Benchmarks

### Expected Performance:
- **Model Load Time:** ~2-3 seconds (first time)
- **Embedding Generation:** ~50-100ms per query (CPU)
- **Embedding Generation:** ~10-20ms per query (GPU)
- **Pinecone Query:** ~100-200ms per namespace
- **Total Search Time:** ~500-800ms (4 namespaces, CPU)

### Optimization Tips:
1. **Cache Model:** Load once at startup, reuse for all requests
2. **Batch Queries:** If processing multiple queries, batch encode them
3. **Use GPU:** Significant speedup for embedding generation
4. **Adjust top_k:** Lower top_k = faster queries
5. **Parallel Namespace Search:** Consider concurrent queries (not implemented by default)

---

## 🆘 Troubleshooting

### Common Issues:

**Issue:** "Dimension mismatch error"
- **Cause:** Using old 384-dim embeddings with new index
- **Fix:** Ensure model is `BAAI/bge-base-en-v1.5` and index is `ncert-local-bge-base`

**Issue:** "No results with class filter"
- **Cause:** Using wrong metadata field for filtering
- **Fix:** Use `class_normalized` not `class` or `class_num`

**Issue:** "Model download slow/failing"
- **Cause:** Hugging Face rate limiting
- **Fix:** Set `HF_TOKEN` environment variable or retry

**Issue:** "Empty results for valid query"
- **Cause:** Score threshold too high or missing normalization
- **Fix:** Check `normalize_embeddings=True` and lower threshold

---

## 📝 Summary Checklist

Before deploying your backend code, verify:

- [ ] Using **BAAI/bge-base-en-v1.5** model
- [ ] Connecting to **ncert-local-bge-base** index
- [ ] Embedding dimension is **768**
- [ ] Always using `normalize_embeddings=True`
- [ ] Searching **all 4 namespaces**: economics, geography, history, polity
- [ ] Using **class_normalized** for filtering (not class or class_num)
- [ ] Normalizing user class input (10th → class-10)
- [ ] Reusing query embedding across namespaces
- [ ] Returning metadata with all 4 class fields
- [ ] Supporting class filter values: class-6 through class-12

---

## 📞 Support Information

**Training Data Location:** `/mnt/bridge/Nextwave_Project_Psetu/PRATIYOGITA_GYAN/CONTENT/content_data/`

**Training Script:** `/mnt/bridge/Nextwave_Project_Psetu/PRATIYOGITA_GYAN/DATA_TRAINING/train_text.py`

**Total Records Indexed:** 3,162
- Economics: 763
- Geography: 692
- History: 741
- Polity: 966

**Last Training Date:** February 13, 2026

---

**Document Version:** 1.0  
**Author:** GitHub Copilot  
**System Status:** ✅ Fully Operational
