# Excel Import Format for Member Registrations

## Column Order (First 5 columns are REQUIRED):

| Column | Type | Required | Example | Notes |
|--------|------|----------|---------|-------|
| **Full Name** | Text | ✅ Yes | John Doe | Cannot be empty |
| **Student ID** | Text | ✅ Yes | 242-33-001 | Must be unique, no duplicates allowed |
| **DIU Email** | Email | ✅ Yes | john242-33-001@diu.edu.bd | Must be valid email format, must be unique |
| **Mobile Phone** | Text | ✅ Yes | 01712345678 | Phone number with country code |
| **Department** | Text | ✅ Yes | CSE | Department code (CSE, EEE, BBA, etc.) |

## Additional Optional Columns:

| Column | Type | Required | Example | Default Value |
|--------|------|----------|---------|----------------|
| Batch | Text | ❌ No | 56 | - |
| Current Year | Text | ❌ No | 3rd | - |
| CGPA | Number | ❌ No | 3.75 | - |
| Previous Experience | Text | ❌ No | Robotics competition | Empty string |
| Why Join | Text | ❌ No | I want to learn | Empty string |
| Skills | Text | ❌ No | Programming, Electronics | Empty string |
| Payment Method | Text | ❌ No | bkash | bkash (default) |
| Payment Number | Text | ❌ No | 01712345678 | Empty string |
| Transaction ID | Text | ❌ No | ABC123XYZ | Empty string |
| Payment Status | Text | ❌ No | verified | "verified" (auto-set) |
| Status | Text | ❌ No | approved | "approved" (auto-set) |

## Instructions:

1. **File Format**: Use `.xlsx`, `.xls`, or `.csv` files
2. **First Row**: Must contain column headers exactly as shown above
3. **Data Validation**:
   - Full Name: Cannot be empty
   - Student ID: Must be unique (system checks for duplicates)
   - DIU Email: Must be unique and valid format (system checks for duplicates)
   - Mobile Phone: Cannot be empty
   - Department: Cannot be empty

4. **Import Tips**:
   - Maximum 500 records per import (for optimal performance)
   - Duplicates are detected by Student ID or Email - import will be rejected if duplicates are found
   - Any rows with validation errors will be skipped with error message
   - Import failure shows which rows failed and why

5. **Download Template**: Use the "Download Template" button in the admin panel to get a pre-formatted CSV file

## Example File Structure:

```
Full Name,Student ID,DIU Email,Mobile Phone,Department,Batch,Current Year,CGPA,Previous Experience,Why Join,Skills,Payment Method,Payment Number,Transaction ID
John Doe,242-33-001,john242-33-001@diu.edu.bd,01712345678,CSE,56,3rd,3.75,Robotics Competition,Learn new skills,Programming/Electronics,bkash,01712345678,ABC123XYZ
Jane Smith,242-33-002,jane242-33-002@diu.edu.bd,01987654321,EEE,56,3rd,3.65,Tech Club,Interested in tech,Electronics/Design,bkash,01987654321,XYZ789ABC
```
