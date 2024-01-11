const express = require("express");
const router = express.Router();
const { Lead, Developer } = require("./model");
const { verifyToken } = require("./middleware");
//----- ALL LEADS FOR MARKETING ADMIN

// router.get("/allLeads", async (req, res) => {
//   console.log("all leads route hit");
//   try {
//     const result = await Lead.find();
//     console.log(result)
//     res.send(result);
//   } catch (error) {
//     console.error("Error fetching leads:", error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// ----------SINGLE USER GET LEAD
router.get("/singleUserLeads", async (req, res) => {
  const email = req.query.email;
  try {
    const result = await Lead.find(
      { entryBy: email },
      {
        firstCallDate: 0,
        firstMeetingDate: 0,
        converted: 0,
        reasonForNonConversion: 0,
        websiteCreation: 0,
        ourCreatedWebsiteLink: 0,
        messageSentAtFirstApproach: 0,
        marketingMessageSent: 0,
      }
    );
    res.send(result);
  } catch (error) {
    console.error("Error fetching leads:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ------------FOR EDITING LEAD DATA GET ROUTE

router.get("/editLeadGet/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await Lead.find(
      { _id: id },
      {
        firstCallDate: 0,
        firstMeetingDate: 0,
        converted: 0,
        reasonForNonConversion: 0,
        websiteCreation: 0,
        ourCreatedWebsiteLink: 0,
        messageSentAtFirstApproach: 0,
        marketingMessageSent: 0,
      }
    );
    res.send(result);
  } catch (error) {
    console.error("Error fetching leads:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//----------- DELETE LEAD

router.delete("/deleteLead/:id", async (req, res) => {
  try {
    console.log("delete route hit");
    const id = req.params.id;
    console.log("delete id", id);
    const result = await Lead.deleteOne({ _id: id });
    res.send(result);
  } catch (error) {
    console.error("Error deleting leads:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// SINGLE LEAD GET ROUTE

router.get("/allLeads/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Lead.findById(id);
    res.send(result);
  } catch (error) {
    console.error("Error fetching leads:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// --------FOR POST LEAD TO DEVELOPER COLLECTION ROUTE
router.post("/leadPostForDeveloper/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const postFound = await Lead.findById(id);
    if (postFound) {
      const leadPostDate = new Date();
      const data = {
        ...postFound._doc,
        leadPostDate,
        developerName: "",
        developerEmail: "",
      };

      const saveData = new Developer(data);

      const savePost = await saveData.save();

      if (savePost) {
        const result = await Lead.findByIdAndDelete(id);
        res.send(result);
      }
    }
  } catch (error) {
    console.log("Error in posting", error);
    res.status(500).send("Internal Server Error");
  }
});

// ----------FOR ADD LEAD POST ROUTE
router.post("/addLead", verifyToken, async (req, res) => {
  console.log("add lead route hit");
  try {
    const lead = new Lead(req.body);
    const result = await lead.save();
    res.send(result);
  } catch (error) {
    console.error("Error adding lead:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ---------EDIT LEAD DATA PATCH ROUTE
router.patch("/editLeadPatch/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const editedData = req.body;

    const { userEmail, timestamp, ...updatedField } = editedData;

    const newChangedItem = {
      userEmail,
      timestamp,
      changedItem: updatedField,
    };

    const result = await Lead.findByIdAndUpdate(
      id,
      {
        $set: updatedField,
        $push: { changeHistory: newChangedItem },
      },
      { new: true }
    );

    res.send(result);
  } catch (error) {
    console.log("Error in lead updating", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
