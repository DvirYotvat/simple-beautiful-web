// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATEWDVogD4qmK8plR0ECmTi6COF3sXKsI",
  authDomain: "simple-beautiful.firebaseapp.com",
  databaseURL: "https://simple-beautiful-default-rtdb.firebaseio.com",
  projectId: "simple-beautiful",
  storageBucket: "simple-beautiful.appspot.com",
  messagingSenderId: "1051214229102",
  appId: "1:1051214229102:web:ae39f1f16d350e853a007f",
  measurementId: "G-HP7Q0JDM2B",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let ImgName, ImgUrl, ImgType;
let files = [];
let reader;

// select image from pc
document.getElementById("select").onclick = function (e) {
  let input = document.createElement("input");
  input.type = "file";

  input.onchange = (e) => {
    files = e.target.files;
    reader = new FileReader();
    reader.onload = function () {
      document.getElementById("myimg").src = reader.result;
    };
    reader.readAsDataURL(files[0]);
  };
  input.click();
};

// upload image to the firebase storege
document.getElementById("upload").onclick = function () {
  // case not selected name for the image return
  if (!$("#namebox").val()) {
    alert("נא לבחור שם לתמונה");
    return;
  }

  if (!$("#typebox").val()) {
    alert("נא לבחור קטגוריה לתמונה");
    return;
  }

  ImgType = document.getElementById("typebox").value;

  // upload the image to the firebase storege
  ImgName = document.getElementById("namebox").value;
  let uploadTask = firebase
    .storage()
    .ref("Images/" + ImgName + ".png")
    .put(files[0]);

  // show % of upload
  uploadTask.on(
    "state_changed",
    function (snapshot) {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("UpProgress").innerHTML =
        "Upload " + progress + "%";
    },

    function (error) {
      alert("error to upload img");
    },

    // upload the image ditails to firebase database of the image
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
        ImgUrl = url;

        firebase
          .database()
          .ref("Images/" + ImgName)
          .set({
            Name: ImgName,
            Link: ImgUrl,
            Type: ImgType,
          });
        alert("תמונה עלתה בהצלחה");
      });
    }
  );
};

// get all images from the firebase and show the admin the images to delete
function getImagesToDelete() {
  // reset div
  let div = document.getElementById("delete_imgs");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  // run on all the data in the realtime database in filde Images
  let rootref = firebase.database().ref().child("Images");
  rootref.on("child_added", (snap) => {
    let image = snap.child("Link").val();
    let imageName = snap.child("Name").val();

    let str = `<div> <button id="${imageName}" onclick="deleteImg('${imageName}')"> <img src= ${image} style="width:150px" style="height:150px"></img> </button></div>`;

    $("#delete_imgs").append(str);
  });
}

// delete images from firebase storage and data of image from firebase realtime database
function deleteImg(imageName) {
  if (confirm("האם אתה בטוח שברצונך למחוק תמונה זו?")) {
    // delete image from firebase storage
    firebase
      .storage()
      .ref("Images/" + imageName + ".png")
      .delete();

    // delete data of image from firebase realtime database
    firebase.database().ref("Images").child(imageName).remove();

    // reset div
    let div = document.getElementById("delete_imgs");
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    // call back to all images
    getImagesToDelete();
  } else {
    return;
  }
}

// get all images from the firebase
function getImages() {
  let rootref = firebase.database().ref().child("Images");

  // get images from firebase
  rootref.on("child_added", (snap) => {
    let image = snap.child("Link").val();
    let imageName = snap.child("Name").val();
    let imageType = snap.child("Type").val();
    let str;
    // str = `<div
    // class="
    //   col-lg-4 col-md-6
    //   portfolio-thumbnail
    //   all
    //   ${imageType}
    // ">
    // <a class="popup-img" href="${image}">
    //   <img src="${image}" />
    // </a>
    // </div>`;

    str = `<div class="column ${imageType}">
    <div class="content">
    <a class="popup-img" href="${image}">
        <img src="${image}" alt="Lights" style="width:100%">
    </a>
    </div>
  </div>`;

    $("#pictures").append(str);

    filterSelection("all");
  });
}

filterSelection("all");
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("column");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

let ImgName2, ImgUrl2;
let files2 = [];
let reader2;

// select image from pc
document.getElementById("select2").onclick = function (e) {
  let input = document.createElement("input");
  input.type = "file";

  input.onchange = (e) => {
    files = e.target.files;
    reader2 = new FileReader();
    reader2.onload = function () {
      document.getElementById("myimg2").src = reader2.result;
    };
    reader2.readAsDataURL(files[0]);
  };
  input.click();
};

// upload image to the firebase storege
document.getElementById("upload2").onclick = function () {
  // case not selected name for the image return
  if (!$("#namebox2").val()) {
    alert("נא לבחור שם לתמונה");
    return;
  }

  // upload the image to the firebase storege
  ImgName = document.getElementById("namebox2").value;
  let uploadTask = firebase
    .storage()
    .ref("tip_images/" + ImgName + ".png")
    .put(files[0]);

  // show % of upload
  uploadTask.on(
    "state_changed2",
    function (snapshot) {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("UpProgress2").innerHTML =
        "Upload " + progress + "%";
    },

    function (error) {
      alert("error to upload img");
    },

    // upload the image ditails to firebase database of the image
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
        ImgUrl = url;

        firebase
          .database()
          .ref("tip_images/" + ImgName)
          .set({
            Name: ImgName,
            Link: ImgUrl,
          });
        alert("תמונה עלתה בהצלחה");
      });
    }
  );
};

// get all images from the firebase and show the admin the images to delete
function getImagesToDelete2() {
  // reset div
  let div = document.getElementById("delete_imgs2");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  // run on all the data in the realtime database in filde Images
  let rootref = firebase.database().ref().child("tip_images");
  rootref.on("child_added", (snap) => {
    let image = snap.child("Link").val();
    let imageName = snap.child("Name").val();

    let str = `<div> <button id="${imageName}" onclick="deleteImg2('${imageName}')"> <img src= ${image} style="width:150px" style="height:150px"></img> </button></div>`;

    $("#delete_imgs2").append(str);
  });
}

// delete images from firebase storage and data of image from firebase realtime database
function deleteImg2(imageName) {
  if (confirm("האם אתה בטוח שברצונך למחוק תמונה זו?")) {
    // delete image from firebase storage
    firebase
      .storage()
      .ref("tip_images/" + imageName + ".png")
      .delete();

    // delete data of image from firebase realtime database
    firebase.database().ref("tip_images").child(imageName).remove();

    // reset div
    let div = document.getElementById("delete_imgs2");
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    // call back to all images
    getImagesToDelete();
  } else {
    return;
  }
}

// get all images from the firebase
function getTipImages() {
  let rootref = firebase.database().ref().child("tip_images");

  // get images from firebase
  rootref.on("child_added", (snap) => {
    let image = snap.child("Link").val();
    let imageName = snap.child("Name").val();
    let str;
    str = `<div class="col-lg-4 col-md-6">
    <div class="journal-info">
      <a href="blog-single.html"
        ><img
          src="${image}"
          class="img-responsive"
          alt="img"
      /></a>
    </div>
  </div>`;

    $("#pictures2").append(str);
  });
}

function getImagesAndTips() {
  getTipImages();
  getImages();
}

function csubmitForm() {
  // initiate variables with form content
  var name = $("#cname").val();
  var emailUser = $("#cemail").val();
  var message = $("#cmessage").val();
  //var ander = "מ%0D" + emailUser + message

  // *********** //
  window.open(
    "mailto:noy.rachmani@gmail.com?subject=יצירת קשר  - " +
      name +
      "&body=מייל לחזרה: " +
      emailUser +
      "%0d" +
      "%0d" +
      message +
      "%0d"
  );

  // *********** //
}
