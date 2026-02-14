# Mock Data Customization Guide

## 📍 Location
The mock data function is located in:
```
chatbot/pratiyogita_yogya/src/Pages/checkeligibilitypage.jsx
```

**Search for:** `MOCK DATA FILL FUNCTION` (around line 847)

## 🎯 What Gets Filled

### 1. Personal Information
- Date of Birth
- Gender
- Marital Status
- Nationality
- Caste/Category
- PWD Status
- Domicile
- NCC Details

### 2. Educational Information (Complete Table)
- **Graduation**
  - Course: **BTech** (exact case matters!)
  - Subject: **Computer Science & Engineering** (exact format)
  - Status: PASSED
  - Marks: 75%
  - Year: 2023
  - Backlogs: 0

- **12th**
  - Course: **Science** (not SCIENCE)
  - Subject: **Physics, Chemistry, Mathematics (PCM)** (exact format)
  - Status: PASSED
  - Marks: 85%
  - Year: 2018
  - Backlogs: 0

- **10th**
  - Course: **(10TH) SECONDARY**
  - Subject: **Science, Mathematics, Social Science, Languages**
  - Status: PASSED
  - Marks: 80%
  - Year: 2016
  - Backlogs: 0

⚠️ **IMPORTANT:** Values must match dropdown options EXACTLY (case-sensitive)!

## ✏️ How to Customize

### Quick Edit
1. Open `checkeligibilitypage.jsx`
2. Press `Ctrl+F` and search for: `MOCK DATA FILL FUNCTION`
3. Edit the values in the clearly marked sections

### Example: Change Graduation Course
```javascript
'GRADUATION': {
    course: 'BSc',                     // Changed from BTech (exact case!)
    subject: 'Computer Science',       // Changed (must match BSc subjects)
    haveStudied: 'YES',
    completionStatus: 'PASSED',
    marks: '70',                       // Changed from 75
    completedYear: '2022',             // Changed from 2023
    activeBacklogs: '0'
}
```

### Example: Change 12th Stream
```javascript
'(12TH)HIGHER SECONDARY': {
    course: 'Commerce',                // Changed from Science
    subject: 'Accountancy, Business Studies, Economics',  // Commerce subjects
    haveStudied: 'YES',
    completionStatus: 'PASSED',
    marks: '82',
    completedYear: '2018',
    activeBacklogs: '0'
}
```

### Example: Change Personal Info
```javascript
gender: 'FEMALE',                      // Changed from MALE
marital_status: 'MARRIED',             // Changed from UNMARRIED
caste_category: 'OBC',                 // Changed from GEN
domicile: 'MUMBAI',                    // Changed from DELHI
```

### Example: Add Post Graduation
```javascript
const mockEducationData = {
    'POST GRADUATION': {
        course: 'M.TECH',
        subject: 'DATA SCIENCE',
        haveStudied: 'YES',
        completionStatus: 'APPEARING',  // Still studying
        marks: '0',                     // No marks yet
        completedYear: '2024',
        activeBacklogs: '0'
    },
    'GRADUATION': {
        // ... existing graduation data
    },
    // ... rest of the data
};
```

## 📋 Available Options

### Gender
- `MALE`
- `FEMALE`
- `TRANSGENDER`

### Marital Status
- `UNMARRIED`
- `MARRIED`
- `SEPARATED`
- `DIVORCED` / `DIVORCEE`
- `WIDOW` / `WIDOWER`

### Caste/Category
- `GEN` (General)
- `SC` (Scheduled Caste)
- `ST` (Scheduled Tribe)
- `OBC` (Other Backward Class)
- `EWS` (Economically Weaker Section)

### PWD Status
- `YES`
- `NO`

### NCC Wing
- `NONE`
- `ARMY`
- `NAVY`
- `AIR FORCE`

### Completion Status
- `PASSED`
- `APPEARING`
- `1ST YEAR`, `2ND YEAR`, `3RD YEAR`, `4TH YEAR`, etc.
- `1st Sem`, `2nd Sem`, `3rd Sem`, etc.

### Education Levels
- `POST DOCTORATE`
- `PHD`
- `POST GRADUATION`
- `GRADUATION`
- `DIPLOMA / ITI (POLYTECHNIC, ITI, DPHARM, PGDCA)`
- `(12TH)HIGHER SECONDARY`
- `(10TH)SECONDARY`
- `(8TH)CLASS`
- `(5TH)CLASS`

### Common Graduation Courses (EXACT CASE)
- **BTech**, **BE**, **BSc**, **BA**, **BCom**, **MBBS**, **BDS**, **LLB**, **BCA**, **BBA**, **BPharm**, **BEd**, **BArch**, **BHM**, **OTHER**

### BTech Subjects
- Computer Science & Engineering
- Information Technology
- Mechanical Engineering
- Civil Engineering
- Electrical Engineering
- Electronics & Communication
- OTHER

### BSc Subjects
- Physics
- Chemistry
- Mathematics
- Computer Science
- Biotechnology
- OTHER

### Common 12th Streams (EXACT CASE)
- **Science**, **Commerce**, **Arts**, **Vocational**, **OTHER**

### Science Subjects (12th)
- Physics, Chemistry, Mathematics (PCM)
- Physics, Chemistry, Biology (PCB)
- Physics, Chemistry, Mathematics, Biology (PCMB)
- OTHER

### Commerce Subjects (12th)
- Accountancy, Business Studies, Economics
- Accountancy, Mathematics, Economics
- OTHER

### Common 10th Course
- **(10TH) SECONDARY**

### 10th Subjects
- Science, Mathematics, Social Science, Languages
- OTHER

## 🧪 Testing Different Scenarios

### Scenario 1: Fresh Graduate
```javascript
highest_education_qualification: 'GRADUATION',
// In education table:
completionStatus: 'PASSED',
completedYear: '2023',
```

### Scenario 2: Still Studying
```javascript
completionStatus: 'APPEARING',  // or '3RD YEAR', '6th Sem', etc.
marks: '0',  // No final marks yet
```

### Scenario 3: With Active Backlogs
```javascript
activeBacklogs: '2',  // Change from 0 to any number
```

### Scenario 4: Multiple Education Levels
Just add more levels in `mockEducationData` based on your `highest_education_qualification`

## 💡 Tips
1. **Always save the file** after making changes
2. **Reload the page** to see changes take effect
3. The mock data is meant for **testing only**
4. You can create **multiple mock data sets** by copying the function
5. The alert message can be customized at the end of the function

## 🔍 Quick Search Terms
Use these in your editor's search to jump to sections:
- `MOCK DATA FILL FUNCTION` - Main function
- `PERSONAL INFORMATION` - Personal details section
- `EDUCATION TABLE DATA` - Education details section
- `mockEducationData` - The education data object

## ⚠️ Important Notes
- Dates must be in format: `YYYY-MM-DD` (e.g., `2000-06-15`)
- Marks should be 0-100 (percentage)
- Years should be 4 digits (e.g., `2023`)
- All text values are case-sensitive
- The function is around line **847** in the file
