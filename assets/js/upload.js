
// no react or anything
let state = {};

// state management
function updateState(newState) {
  state = { ...state, ...newState };
  // console.log(state);
}

// event handlers
$("#file-upload").change(function (e) {
  let files = document.querySelector("#file-upload").files;
  console.log('files', files)
  let filesArr = Array.from(files);
  updateState({ files: files, filesArr: filesArr });

  renderFileList();
});

$(".files").on("click", "li > .fa-times", function (e) {
  let key = $(this).parent().attr("key");
  let curArr = state.filesArr;
  curArr.splice(key, 1);
  updateState({ filesArr: curArr });
  renderFileList();
});

// $("form").on("submit", function (e) {
//   e.preventDefault();
//   console.log(state);
//   renderFileList();
// });

// render functions
function renderFileList() {
  let fileMap = state.filesArr.map((file, index) => {
    let suffix = "bytes";
    let icon = "fa-file";
    let size = file.size;
    let type = file.type;
    if (size >= 1024 && size < 1024000) {
      suffix = "KB";
      size = Math.round(size / 1024 * 100) / 100;
    } else if (size >= 1024000) {
      suffix = "MB";
      size = Math.round(size / 1024000 * 100) / 100;
    }
    if (type.includes('.document')) {
      icon = "fa-file-word"
    } else if (type.includes('.sheet') || type.includes('excel') ) {
      icon = "fa-file-excel" 
    } else if (type.includes('zip') || type.includes('compressed') ) {
      // icon = "fa-file-lines" 
    } else if (type.includes('pdf')) {
      icon = "fa-file-pdf" 
    } else if (type.includes('png') || type.includes('jpeg')) {
      icon = "fa-file-image" 
    }

    return `<li key="${index}">
      <i class="icon fs-1 fas ${icon}"></i>
      ${file.name}
      <span class="file-size">${size} ${suffix}</span>
      <i class="fs-5 fas fa-times"></i>
    </li>`;
  });
  $(".custom-file-upload ul").html(fileMap);
}

function previewFile() {

        document.getElementById('fileInput').addEventListener('change', function (event) {
            const files = event.target.files;
            const previewContainer = document.getElementById('previewContainer');
            
            previewContainer.innerHTML = ''; // Clear previous previews

            Array.from(files).forEach(file => {
                const fileType = file.type;
                
                // Check for image file types
                if (fileType.startsWith('image')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.maxWidth = '200px'; // Optional styling
                        previewContainer.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
                // Check for video file types
                else if (fileType.startsWith('video')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const video = document.createElement('video');
                        video.src = e.target.result;
                        video.controls = true;
                        video.style.maxWidth = '200px'; // Optional styling
                        previewContainer.appendChild(video);
                    };
                    reader.readAsDataURL(file);
                }
                // Check for PDF file types
                else if (fileType === 'application/pdf') {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const pdfPreview = document.createElement('embed');
                        pdfPreview.src = e.target.result;
                        pdfPreview.type = 'application/pdf';
                        pdfPreview.style.width = '200px'; // Optional styling
                        pdfPreview.style.height = '300px'; // Optional styling
                        previewContainer.appendChild(pdfPreview);
                    };
                    reader.readAsDataURL(file);
                }
                // Handle other file types (e.g., text files, etc.)
                else {
                    const fileName = document.createElement('p');
                    fileName.textContent = `File: ${file.name}`;
                    previewContainer.appendChild(fileName);
                }
            });
        });

}