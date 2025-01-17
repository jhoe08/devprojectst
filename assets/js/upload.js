
// no react or anything
let state = {};

// state management
function updateState(newState) {
  state = { ...state, ...newState };
  console.log(state);
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
