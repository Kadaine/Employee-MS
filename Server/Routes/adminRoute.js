import express from 'express'
import con from '../utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/adminlogin', (req, res) => {
    //console.log(req.body) //Use to Validate that the submitted information is correct
    const sql = 'SELECT * from admin WHERE email = ? AND password = ?'
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: 'Query error' })
        if (result.length > 0) {
            const email = result[0].email
            const token = jwt.sign(
                { role: 'admin', email: email },
                'jwt_secret_key',
                { expiresIn: '1d' })
            res.cookie('token', token)
            return res.json({ loginStatus: true })
        } else {
            return res.json({ loginStatus: false, Error: 'Wrong email or password'})
        }
    }) //Replaces the "?" in line 8 above with the request email and password
})

router.post('/add_category', (req, res) => {
    const sql = 'INSERT INTO category (`name`) VALUES (?)'
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: 'Query Error'})
        return res.json({Status: true})
    })
})

router.get('/category', (req, res) => {
    const sql = 'SELECT * FROM category'
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: 'Query Error'})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_employee', (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: 'Query Error'})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.body.image,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

router.get('/employee', (req, res) => {
    const sql = 'SELECT * FROM employee'
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: 'Query Error'})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM employee WHERE id = ?'
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: 'Query Error'})
        return res.json({Status: true, Result: result})

    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id
    const sql = 'Update employee SET name = ?, email = ?, salary = ?, address = ?, category_id = ? WHERE id = ?'
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        console.log(values)
        if(err) return res.json({Status: false, Error: 'Query Error' + err})
        return res.json({Status: true, Result: result})

    })
})

export { router as adminRouter }