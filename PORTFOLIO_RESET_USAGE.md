# Portfolio Reset Usage

## How to Reset Portfolio State

To reset the portfolio state (start fresh for a new tournament), you can use the reset API endpoint.

### Option 1: Using cURL

```bash
curl -X DELETE http://localhost:3000/api/portfolio-reset
```

### Option 2: Using Browser/Postman

- Method: `DELETE`
- URL: `http://localhost:3000/api/portfolio-reset`
- No body required

### Option 3: Using JavaScript/Fetch

```javascript
fetch('/api/portfolio-reset', {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Option 4: Manual File Deletion

Simply delete the file:
- Path: `data/portfolios/portfolio_state.json`

The file will be automatically recreated on the next calculation if it doesn't exist.

---

## Response

**Success (200):**
```json
{
  "message": "Portfolio state reset successfully"
}
```

**Already Empty (200):**
```json
{
  "message": "No portfolio state to reset"
}
```

**Error (500):**
```json
{
  "error": "Failed to reset portfolio: [error message]"
}
```

