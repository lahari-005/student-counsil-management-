const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
  
app.listen(PORT, console.log(`Server running on the port number ${PORT}`));

//Configuration (MONGODB)
var curl = "mongodb://localhost:27017";
var client = new MongoClient(curl); 


//STUDENT LOGIN MODULE
app.post('/login/student', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        const { regNo, pass } = req.body;
        const user = await users.findOne({ regNo, pass });
        if (user) {
            // Successful login
            res.json({ success: true, message: 'Login successful' });
        } else {
            // Failed login
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        conn.close();
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//COUNSELLOR LOGIN MODULE
app.post('/login/counsellor', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        const { counselorId, cpass } = req.body;
        const counsellor = await users.findOne({ counselorId, cpass });
        if (counsellor) {
            // Successful login
            res.json({ success: true, message: 'Login successful' });
        } else {
            // Failed login
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        conn.close();
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//STUDENTHOME MODULE
app.post('/studenthome/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        data = await users.find(req.body,{projection:{regNo : true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});


//COUNSELLORHOME MODULE
app.post('/counsellorhome/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        data = await users.find(req.body,{projection:{firstName: true,lastName: true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//ADMIN HOME MENU
app.post('/adminhome/adminmenu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        adminmenu = db.collection('adminmenu');
        data = await adminmenu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//ADMIN HOME SUB MENUS
app.post('/adminhome/adminmenus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        adminmenus = db.collection('adminmenus');
        data = await adminmenus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/registration/signup', async function(req, res) {
    try {
        const userData = req.body; // Assuming data is sent in the request body
        const conn = await client.connect();
        const db = conn.db('SDP41');
        const users = db.collection('users');

        const insertedData = await users.insertOne(userData);
        conn.close();

        // Send the inserted data as the response
        res.json(insertedData.ops[0]);
    } catch(err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to insert data into the database." });
    }
});

app.get('/counselors', async function(req, res) {
    try {
        const conn = await client.connect();
        const db = conn.db('SDP41');
        const counselors = db.collection('counsellor');
        
        // Retrieve counselor data with counselorId projection
        const data = await counselors.find({}, { projection: { counselorId: 1 } }).toArray();
        conn.close();
        
        res.json(data);
    } catch(err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to retrieve counselor data." });
    }
});







//View Student MODULE
app.get('/viewstudent/details', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        data = await users.find().sort({ regNo: 1 }).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});



//ADMINHOME ADD Counsellor
app.post('/registration/addcounsellor', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    }catch(err)
    {
        res.json(err).status(404);
    }
});


//View Counsellor MODULE
app.get('/viewcounsellor/details', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        data = await users.find().sort({ counselorId : 1 }).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.delete('/deletecounsellor/:counselorId', async function(req, res){
    const counselorId = req.params.counselorId;
    try {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        const result = await users.deleteOne({ counselorId: counselorId });
        if(result.deletedCount === 1) {
            res.json({ message: "Counselor deleted successfully" });
        } else {
            res.status(404).json({ message: "Counselor not found" });
        }
        conn.close();
    } catch(err) {
        res.status(500).json({ message: "Error deleting counselor", error: err });
    }
});



app.delete('/deletestudent/:regNo', async function(req, res){
    const regNo = req.params.regNo;
    try {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        const result = await users.deleteOne({ regNo: regNo });
        if(result.deletedCount === 1) {
            res.json({ message: "Student deleted successfully" });
        } else {
            res.status(404).json({ message: "Student not found" });
        }
        conn.close();
    } catch(err) {
        res.status(500).json({ message: "Error deleting Student", error: err });
    }
});




//STUDENT HOME MENU
app.post('/studenthome/studentmenu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        studentmenu = db.collection('studentmenu');
        data = await studentmenu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//STUDENT HOME SUB MENUS
app.post('/studenthome/studentmenus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        studentmenus = db.collection('studentmenus');
        data = await studentmenus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});



//CHANGE PASSWORD
app.post('/cp/supdatepwd', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        data = await users.updateOne({regNo : req.body.regNo}, {$set : {pass: req.body.pass}});
        conn.close();
        res.json("Password has been updated")
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/cp/cupdatepwd', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        data = await users.updateOne({counselorId : req.body.counselorId}, {$set : {cpass: req.body.cpass}});
        conn.close();
        res.json("Password has been updated")
    }catch(err)
    {
        res.json(err).status(404);
    }
});


//MY PROFILE
app.post('/myprofile/sinfo', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        data = await users.find(req.body).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/myprofile/cinfo', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        data = await users.find(req.body).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});



//COUNSELLOR HOME MENU
app.post('/counsellorhome/counsellormenu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        studentmenu = db.collection('counsellormenu');
        data = await studentmenu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//COUNSELLOR HOME SUB MENUS
app.post('/counsellorhome/counsellormenus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        studentmenus = db.collection('counsellormenus');
        data = await studentmenus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});




// Backend code (app.js)
// Assuming you have MongoDB set up and connected

app.post('/assigncounselor', async function(req, res) {
    try {
        
        // Assuming you have a collection named counselorAssignments with documents containing counselorId and assignedRegNos fields
        const conn = await client.connect();
        const db = conn.db('SDP41');
        const counselorAssignments = db.collection('counselorAssignments');

        // Update or insert a document with the provided counselorId
        data = await counselorAssignments.insertOne(req.body);
        conn.close();
        res.json(data);
        
    } catch(err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});




// Example API endpoints to retrieve counselor IDs and student registration numbers

// Endpoint to retrieve counselor IDs
app.get('/counselorIds', async function(req, res) {
    try {
        // Assuming you have a collection named counselorAssignments with documents containing counselorId field
        const conn = await client.connect();
        const db = conn.db('SDP41');
        const counsellor = db.collection('counsellor');
        const data = await counsellor.find({}, { projection: { counselorId: true,firstName:true,lastName:true } }).toArray();
        
        conn.close();
        res.json(data);
    } catch(err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint to retrieve student registration numbers
app.get('/studentregNos', async function(req, res) {
    try {
        // Assuming you have a collection named users with documents containing regNo field
        const conn = await client.connect();
        const db = conn.db('SDP41');
        const users = db.collection('users');
        const data = await users.find({}, { projection: { regNo: true ,firstName:true,lastName:true} }).toArray();
        conn.close();
        res.json(data);
    } catch(err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.get('/studentdetails/:regNo', async function(req, res){
    const regNo = req.params.regNo;
    try {
        const conn = await client.connect();
        const db = conn.db('SDP41');
        const users = db.collection('users');
        const result = await users.findOne(
            { regNo: regNo }, // Query criteria
            { projection: { pass: 0 } } // Projection excluding the pass field
          );
        conn.close();

        if (result) {
            res.json(result); // Send student details if found
        } else {
            res.status(404).json({ message: "Student not found" }); // Send 404 if no student found
        }
    } catch(err) {
        res.status(500).json({ message: "Error fetching student details", error: err });
    }
});


app.get('/counsellordetails/:counselorId', async function(req, res){
    const counselorId = req.params.counselorId;
    try {
        const conn = await client.connect();
        const db = conn.db('SDP41');
        const users = db.collection('counsellor');
        const result = await users.findOne(
            { 
              counselorId: counselorId }, // Query criteria
            { projection: { cpass: 0 } } // Projection excluding the pass field
          );
        conn.close();

        if (result) {
            res.json(result); 
        } else {
            res.status(404).json({ message: "Counsellor not found" }); 
        }
    } catch(err) {
        res.status(500).json({ message: "Error fetching counsellor details", error: err });
    }
});




app.post('/studenthome/sbookappointment', async function(req, res){
    try
    {   userdata = req.body();
        conn = await client.connect();
        db = conn.db('SDP41');
        studentappointments = db.collection('studentappointments');
        data = await studentappointments.insertOne(userData);
        conn.close();
        res.json("Appointment request has been sent...!")
    }catch(err)
    {
        res.json(err).status(404);
    }
});


app.put('/updatestudent/:regNo', async function(req, res){
    const regNo = req.params.regNo;
    const updatedData = req.body; // Assuming the updated data is sent in the request body
    
    try {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        
        const result = await users.updateOne({ regNo: regNo }, { $set: updatedData });
        
        if(result.matchedCount === 1) {
            res.json({ message: "Student updated successfully" });
        } else {
            res.status(404).json({ message: "Student not found" });
        }
        
        conn.close();
    } catch(err) {
        res.status(500).json({ message: "Error updating student", error: err });
    }
});




app.put('/updatecounsellor/:counselorId', async function(req, res){
    const counselorId = req.params.counselorId;
    const updatedData = req.body; // Assuming the updated data is sent in the request body
    
    try {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('counsellor');
        
        const result = await users.updateOne({ counselorId: counselorId }, { $set: updatedData });
        
        if(result.matchedCount === 1) {
            res.json({ message: "Counsellor updated successfully" });
        } else {
            res.status(404).json({ message: "Counsellor not found" });
        }
        
        conn.close();
    } catch(err) {
        res.status(500).json({ message: "Error updating student", error: err });
    }
});



//MY PROFILE
app.post('/student/counsellor', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        counselorAssignments = db.collection('counselorAssignments');
        data = await counselorAssignments.find(req.body,{projection:{counselorId : true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/counsellor/students', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        counselorAssignments = db.collection('counselorAssignments');
        data = await counselorAssignments.find(req.body,{projection:{regNo : true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});


app.post('/student/counsellorinfo', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        counselorAssignments = db.collection('counsellor');
        data = await counselorAssignments.find(req.body).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/counsellor/studentinfo', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('users');
        data = await users.find(req.body).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});


app.post('/student/appointment',async function(req,res){
    try{

        conn = await client.connect();
        db = conn.db('SDP41');
        appointment = db.collection('studentappointments');
        data = await appointment.insertOne(req.body);
        conn.close();
        res.json(data);
    }
    catch(err)
    {
        res.json(err).status(404);
    }
    
});



app.post('/student/myappointments', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('SDP41');
        users = db.collection('studentappointments');
        data = await users.find(req.body).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.put('/student/updateappointment/:regNo', async (req, res) => {
    try {
        console.log('Received request to update appointment:', req.body);

        // Connect to the database
        await client.connect();
        const db = client.db('SDP41');
        const appointments = db.collection('studentappointments');

        // Extract the regNo, status, and counsellorReply from the request parameters and body
        const { regNo } = req.params;
        const { status, counsellorReply } = req.body;

        // Check if regNo is provided
        if (!regNo) {
            return res.status(400).json({ error: 'regNo is required.' });
        }

        // Update the appointment in the database using regNo
        const result = await appointments.updateOne(
            { regNo },
            {
                $set: {
                    status,
                    counsellorReply,
                }
            }
        );

        // Check if an appointment was updated
        if (result.modifiedCount > 0) {
            res.json({ message: 'Appointment updated successfully.' });
        } else {
            res.status(404).json({ error: 'Appointment not found or no changes made.' });
        }
    } catch (err) {
        console.error('Error updating appointment:', err);
        res.status(500).json({ error: 'An error occurred while updating the appointment.' });
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
});




