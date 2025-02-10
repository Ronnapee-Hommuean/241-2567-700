const express = require('express');
const bodyparset = require('body-parser');
const app = express();

const port = 8000;

app.use(bodyparset.json());

let users = []
let counter = 1

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับดึง users รายคนออกมา
PUT /users/:id สำหรับแก้ไขข้อมูล users รายคน(ต้องระบุ id)
DELETE /users/:id สำหรับลบ users รายคน(ต้องระบุ id)
*/ 


//path = GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', (req, res) => {
  res.json(users);
});

//path = POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', (req, res) => {
  let user = req.body;
  user.id = counter;
  counter += 1;
  users.push(user);
  res.json({
    message: 'Create new user successfully',
    user: user
  });
});

//path = PUT /users/:id สำหรับแก้ไขข้อมูล users รายคน(ต้องระบุ id)
app.put('/user/:id', (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;

  //1.หา users จาก id ที่ส่งมา
  let selectedIndex = users.findIndex(user => user.id == id)

  //2.แก้ไขข้อมูล users ที่หาเจอ
  if (updateUser.firsname) {
    users[selectedIndex].firstname = updateUser.firstname
  }
  if (updateUser.lastname) {
    users[selectedIndex].lastname = updateUser.lastname
  }

  res.json({
    message: 'Update user successfully',
    data: {
      users: updateUser,
      indexUpdated: selectedIndex
    }
  })
  
     
});

//path = DELETE /users/:id สำหรับลบ users รายคน(ต้องระบุ id)
//path: DELETE /user/:id ใช้สำหรับลบข้อมูล user ตาม id ที่ระบุ
app.delete('/user/:id', (req, res) => {
  let id = req.params.id;

  //หา index ของ user ที่ต้องการลบ
  let selectedIndex = users.findIndex(user => user.id == id)

  //ลบ
  users.splice(selectedIndex, 1)
  res.json({
    message: 'Delete user successfully',
    indexDeleted: selectedIndex
  })
})

app.listen(port, (req, res) => {
  console.log('Http Server running on port: ' + port);
});