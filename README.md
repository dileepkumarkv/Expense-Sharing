# Expense Sharing

Expense Sharing is node.js Api Project

## Installation

```bash
npm install
```

## Start Application

```bash
npm start
```

## Usage

### API End Points

1. Create User

```node.js
End Point - /user
Method - POST
Body
{
    "name":string,
    "email":string,
    "phone":string
}
```

2. Create Group

```node.js
End Point - /group
Method - POST
Body
{
    "name":string,
    "members":Array Of User id
}
```

3. Create Expense

```node.js
End Point - /expense
Method - POST
Body
{
    "name":string,
    "amount":string,
    "paid_by":string,
    "shared_type":string,//can be 0 or 1. 0- Group  1-Individual
    "group_id":string, // if shared type=0. id of group
    "members":Array Of User id // if shared type=1
}
```

4. Get Expense By User

```node.js
End Point - /expense/:id
Method - GET
Params - id of user
```
