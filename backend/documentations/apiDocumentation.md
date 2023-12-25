# POST User

## endpoint

/user

## body

x-www-form-urlencoded

```
name:string
password:string
```

## 201

```json
{
  "message": "User successfully created.",
  "obj": {
    "id": 2,
    "name": "test",
    "password": "$2b$10$eZwbgwXzWj3vCvTqF3Fz5OZDxhIetGcTXN8nvUGj5b0RkrhmQNgUy",
    "updatedAt": "2023-12-25T03:54:37.695Z",
    "createdAt": "2023-12-25T03:54:37.695Z",
    "image_url": null
  }
}
```

## 400

```json
{
  "message": "Name is required."
}
```

```json
{
  "message": "Name cannot be empty."
}
```

```json
{
  "message": "Password is required."
}
```

```json
{
  "message": "Password cannot be empty."
}
```

## 500

```json
{
  "message": "Internal Server Error."
}
```

# POST User Login

## endpoint

/user/login

## body

x-www-form-urlencoded

```
name:string
password:string
```

## 200

```json
{
  "message": "User successfully logged in.",
  "token": "eyJhbGciOiJIUzI1NiJ9.Mg.HSyZK7J99A_UrZoIJqAICgs0AKdS8T6RAJ0cpBPy7qM",
  "obj": {
    "id": 2,
    "name": "test",
    "password": "$2b$10$eZwbgwXzWj3vCvTqF3Fz5OZDxhIetGcTXN8nvUGj5b0RkrhmQNgUy",
    "image_url": null,
    "createdAt": "2023-12-25T03:54:37.695Z",
    "updatedAt": "2023-12-25T03:54:37.695Z"
  }
}
```

## 401

```json
{
  "message": "User not found. Please check your name or register."
}
```

```json
{
  "message": "Wrong password. Please try again."
}
```

## 500

```json
{
  "message": "Internal Server Error."
}
```

# GET User

## endpoint

/user

## query

```
limit:positive integer
page:positive integer
sort:asc / desc string
sortBy:a col string
search:string
searchBy:name, password string
```

## 200

```json
{
  "message": "Users successfully retrieved.",
  "obj": [
    {
      "id": 2,
      "name": "test",
      "password": "$2b$10$eZwbgwXzWj3vCvTqF3Fz5OZDxhIetGcTXN8nvUGj5b0RkrhmQNgUy",
      "image_url": null,
      "createdAt": "2023-12-25T03:54:37.695Z",
      "updatedAt": "2023-12-25T03:54:37.695Z"
    },
    {
      "id": 3,
      "name": "test2",
      "password": "$2b$10$NvTiY5CuO/8G4dcD0kJ6uOCxUD1k/7Am7iqzIdX1.QeqZOHjr0Xxi",
      "image_url": null,
      "createdAt": "2023-12-25T04:31:25.194Z",
      "updatedAt": "2023-12-25T04:31:25.194Z"
    },
    {
      "id": 4,
      "name": "aaaa",
      "password": "$2b$10$06F2cNXjUPXUHv4O5AAzUejiKJzx4iRYJW6x/RvDjxOVfOWwfVrP6",
      "image_url": null,
      "createdAt": "2023-12-25T04:58:42.208Z",
      "updatedAt": "2023-12-25T04:58:42.208Z"
    }
  ],
  "total": 3
}
```

## 401

```json
{
  "message": "Unauthorized."
}
```

## 500

```json
{
  "message": "Internal Server Error."
}
```

# GET User ID

## endpoint

/user/:id

## params

```
id:positive integer
```

## 200

```json
{
  "message": "User successfully retrieved.",
  "obj": {
    "id": 3,
    "name": "test2",
    "password": "$2b$10$NvTiY5CuO/8G4dcD0kJ6uOCxUD1k/7Am7iqzIdX1.QeqZOHjr0Xxi",
    "image_url": null,
    "createdAt": "2023-12-25T04:31:25.194Z",
    "updatedAt": "2023-12-25T04:31:25.194Z"
  }
}
```

## 401

```json
{
  "message": "Unauthorized."
}
```

## 500

```json
{
  "message": "Internal Server Error."
}
```

# PUT User

## endpoint

/user

## body

x-www-form-urlencoded

```
name:string
password:string
```

## 201

```json
{
  "message": "User successfully updated.",
  "obj": {
    "id": 2,
    "name": "William",
    "password": "$2b$10$9SZw257pddn.LgJBWPbZ1OEGP5QiBg2HSEXYQSPNKwHBoDEubDCty",
    "image_url": null,
    "createdAt": "2023-12-25T03:54:37.695Z",
    "updatedAt": "2023-12-25T05:17:08.105Z"
  }
}
```

## 401

```json
{
  "message": "Unauthorized."
}
```

## 500

```json
{
  "message": "Internal Server Error."
}
```

# PATCH User

## endpoint

/user

## body

form-data

```
image_url:string
```

## 200

```json
{
  "message": "User image url successfully updated.",
  "image_url": "https://ik.imagekit.io/rclzujjqk/Alma_Armas__pVhhpOgF.webp"
}
```

## 400

```json
{
  "message": "File is required."
}
```

## 401

```json
{
  "message": "Unauthorized."
}
```

## 500

```json
{
  "message": "Internal Server Error."
}
```

# DELETE User

## endpoint

/user

## 201

```json
{
  "message": "User successfully deleted."
}
```

## 401

```json
{
  "message": "Unauthorized."
}
```

## 500

```json
{
  "message": "Internal Server Error."
}
```
