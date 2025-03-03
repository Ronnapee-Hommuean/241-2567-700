const express = require('express');
const bodyparset = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');

const port = 8000;

app.use(cors());
app.use(bodyparset.json());

let users = []

let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
  });
}

/*app.get('/testdb', (req, res) => {
  let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
  }).then((conn) => {
    conn.query('SELECT * FROM users')
    .then((results) => {
      res.json(results[0])
    })
    .catch((error) => {
      console.log('error', error.message)
      res.status(500).json({error: 'Error fetching users'})
    })

  })
});*/

/*app.get('/testdbnew',async (req, res) => {
   try{
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'webdb',
      port: 8820
    });
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);

   }catch(error){
    console.log('error', error.message)
    res.status(500).json({error: 'Error fetching users'})
   }
});*/


/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับดึง users รายคนออกมา
PUT /users/:id สำหรับแก้ไขข้อมูล users รายคน(ต้องระบุ id)
DELETE /users/:id สำหรับลบ users รายคน(ต้องระบุ id)
*/

//path = GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', async (req, res) => {
  const results = await conn.query('SELECT * FROM users');
  res.json(results[0]);
});

//path = POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
  try {
    let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', user);
    res.json({
      message: 'Create user successfully',
      data: results[0]
    });
  } catch (error) {
    console.error('error : ', error.message)
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }

});


//path = PUT /users/:id สำหรับแก้ไขข้อมูล users รายคน(ต้องระบุ id)
app.put('/users/:id',async (req, res) => {
  try {
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query('UPDATE users SET ? WHERE id = ?', 
      [updateUser, id]
    );
    res.json({
      message: 'Update user successfully',
      data: results[0]
    });
  } catch (error) {
    console.error('error : ', error.message)
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }

  
});

//path = GET /users/id สำหรับดึง users รายคนออกมา
app.get('/users/:id', async (req, res) => {
  try {
      let id = req.params.id;
      const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
      if (results[0].length == 0) {
       throw {statusCode: 404, message: 'User not found'}
      }
      res.json(results[0][0])
 
  }catch(error){
      console.error('error: ', error.message)
      let statusCode = error.statusCode || 500
      res.status(500).json({
          message: 'something went wrong',
          errorMessage: error.message
      })
  }
})

//path = DELETE /users/:id สำหรับลบ users รายคน(ต้องระบุ id)
//path: DELETE /user/:id ใช้สำหรับลบข้อมูล user ตาม id ที่ระบุ
app.delete('/users/:id', async(req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('DELETE FROM users WHERE id = ?', parseInt(id));/*parseIntเช็คว่าเป็นตัวเลข*/ 
    res.json({
      message: 'Delete user successfully',
      data: results[0]
    });
  } catch (error) {
    console.error('error : ', error.message)
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})


app.listen(port, async (req, res) => {
  await initMySQL()
  console.log('Http Server running on port: ' + port);
});

