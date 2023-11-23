const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const Employee = require('../models/employee.model');

router.get('/employees', async (req, res) => {
  try {
    res.json(await Employee.find())
  }
  catch(err) {
    res.status(500).json({ message: err })
  }
});

router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const emp = await Employee.findOne().skip(rand);

    if(!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/employees', async (req, res) => {
  try {

    const { firstName, lastName, department } = req.body;
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.json({ message: 'OK', employee: newEmployee });
    
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;

  try {
    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, department },
      { new: true }
    );
    if (emp) {
      res.json({ message: 'OK', emp });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (emp) {
      res.json({ message: 'OK', emp });
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
