const send = document.getElementById("flower-send");

current_flower_info = {}

BASE_URL = ""
CLASSIFIY_IMAGE = "/classify/image"

function requestImageClassification(file, success, error) {
  console.log("--- Request image classify ---")
  const data = new FormData();
  data.append('file', file);

  let query = BASE_URL + CLASSIFIY_IMAGE
  $.ajax({
    method: 'POST',
    url: query,
    data: data,
    headers: {
      'Accept': 'application/json',
    },
    crossDomain: true,
    contentType: false,
    processData: false,
    dataType: 'json',
    cache: false,
    success: success,
    error: error
  })
}

function updateflowerName(name) {
  console.log("--- Update flower name ---")
  document.getElementById("flower-name")
    .innerHTML = "<p>" + name + "</p>"
}

function updateflowerDetail(detail, intent) {
  //분류, 설명, 진화, 타입
  content=""
  if (intent === "설명") {
    if (detail['description']) {
      content = "<p style='font-weight:600;'>" + detail['description'] + "</p>"
    }
  }
  console.log("--- Update flower description ---")
  document.getElementById("flower-desc")
    .innerHTML = content
}

function getflowerTitle(result) {
  return result["result"]["name"]
}

function setflowerDetailToGlobal(info) {
  current_flower_info = info
  console.log(current_flower_info)
}
send.addEventListener("click", function () {
  console.log("--- Submit ---")
  const imageInput = document.getElementById("flower-input-image");
  const imageAlbumInput = document.getElementById("flower-input-album-image");

  let imageCameraFile = imageInput.files[0]
  let imageAlbumFile = imageAlbumInput.files[0]
  let imageFile = imageCameraFile ? imageCameraFile : imageAlbumFile;

  console.log("imageFile: ", imageFile)

  // Classify image
  requestImageClassification(
    imageFile,
    function(result) {
      console.log("Success: ", result)
      setflowerDetailToGlobal(result["result"]["detail"])
      updateflowerName(getflowerTitle(result))
      updateflowerDetail(current_flower_info, "설명")
    },
    function(error) {
      console.log("Error: ", error)
  })

  // Clean
  cleanSelectedImage()
  document.getElementById("flower-preview-image").style.visibility = "hidden"
  document.getElementById("flower-preview-nav").style.visibility = "hidden"
});

// Clean selected image
function cleanSelectedImage() {
  const imageInput = document.getElementById("flower-input-image");
  const imageAlbumInput = document.getElementById("flower-input-album-image");

  imageInput.value = null
  imageAlbumInput.value = null
}

const previewClose = document.getElementById('flower-preview-close')
previewClose.addEventListener("click", function () {
  const imageInput = document.getElementById("flower-input-image")
  const imageAlbumInput = document.getElementById("flower-input-album-image")
  imageInput.value = null
  imageAlbumInput.value = null
  document.getElementById("flower-preview-image").style.visibility = "hidden"
  document.getElementById("flower-preview-nav").style.visibility = "hidden"
})

