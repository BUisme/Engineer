(() => {
  "use strict";

  const ACCESS_CODE = "Engineer";
  const AUTH_KEY = "spareOrderForm.auth";
  const FORM_KEY = "spareOrderForm.formData";
  const MAX_IMAGES = 6;

  const loginScreen = document.getElementById("loginScreen");
  const appScreen = document.getElementById("appScreen");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  const imageInput = document.getElementById("imageInput");
  const imageGrid = document.getElementById("imageGrid");
  const imageEditor = document.getElementById("imageEditor");
  const imageLimitNote = document.getElementById("imageLimitNote");

  const clearImagesBtn = document.getElementById("clearImagesBtn");
  const clearFormBtn = document.getElementById("clearFormBtn");
  const printBtn = document.getElementById("printBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const documentCode = document.getElementById("documentCode");

  let images = [];
  let selectedId = null;

  function todayDocumentCode() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function showApp() {
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");

    if (!documentCode.value.trim()) {
      documentCode.value = todayDocumentCode();
    }
  }

  function showLogin() {
    appScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    passwordInput.focus();
  }

  function login() {
    const code = passwordInput.value.trim();

    if (code === ACCESS_CODE) {
      localStorage.setItem(AUTH_KEY, "true");
      loginError.textContent = "";
      passwordInput.value = "";
      showApp();
      return;
    }

    loginError.textContent = "รหัสไม่ถูกต้อง กรุณาลองใหม่";
    passwordInput.select();
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    showLogin();
  }

  function saveForm() {
    const data = {};
    document.querySelectorAll("[data-save]").forEach((el) => {
      data[el.id] = el.value;
    });
    localStorage.setItem(FORM_KEY, JSON.stringify(data));
  }

  function loadForm() {
    const raw = localStorage.getItem(FORM_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
      });
    } catch {
      localStorage.removeItem(FORM_KEY);
    }
  }

  function clearForm() {
    const ok = confirm("ต้องการล้างข้อมูลในแบบฟอร์มหรือไม่?");
    if (!ok) return;

    localStorage.removeItem(FORM_KEY);

    document.getElementById("machinery").value = "";
    document.getElementById("zone").value = "";
    document.getElementById("line").value = "";
    document.getElementById("equipment").value = "";
    document.getElementById("purpose").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("model").value = "";
    document.getElementById("spec").value = "";
    document.getElementById("pcs").value = "";
    documentCode.value = todayDocumentCode();

    saveForm();
  }

  function uid() {
    return `img_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("not image"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function updateImageClasses() {
    const count = images.length;

    imageGrid.className = "image-grid";
    imageGrid.classList.toggle("empty", count === 0);

    if (count === 1) imageGrid.classList.add("one");
    if (count === 3) imageGrid.classList.add("three");
    if (count >= 5) imageGrid.classList.add("many");

    imageLimitNote.classList.toggle("hidden", count < MAX_IMAGES);
  }

  function imageStyle(img) {
    const x = Number(img.x || 0);
    const y = Number(img.y || 0);
    const zoom = Number(img.zoom || 1);
    const rotate = Number(img.rotate || 0);
    return `translate(-50%, -50%) translate(${x}%, ${y}%) scale(${zoom}) rotate(${rotate}deg)`;
  }

  function renderImages() {
    imageGrid.innerHTML = "";

    if (images.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-image-text";
      empty.textContent = "แนบรูปภาพประกอบ";
      imageGrid.appendChild(empty);
      updateImageClasses();
      hideEditor();
      return;
    }

    images.forEach((item) => {
      const box = document.createElement("div");
      box.className = `photo-box ${item.mode === "cover" ? "cover" : "fit"}`;
      box.dataset.id = item.id;
      if (item.id === selectedId) box.classList.add("selected");

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "รูปภาพประกอบ";
      img.style.transform = imageStyle(item);

      box.appendChild(img);
      box.addEventListener("click", () => selectImage(item.id));

      imageGrid.appendChild(box);
    });

    updateImageClasses();
  }

  function selectedImage() {
    return images.find((img) => img.id === selectedId) || null;
  }

  function selectImage(id) {
    selectedId = id;
    imageEditor.classList.remove("hidden");
    renderImages();
  }

  function hideEditor() {
    selectedId = null;
    imageEditor.classList.add("hidden");
    renderImages();
  }

  function editSelected(action) {
    const img = selectedImage();
    if (!img && action !== "done") return;

    switch (action) {
      case "fit":
        img.mode = "fit";
        break;
      case "cover":
        img.mode = "cover";
        break;
      case "zoom-in":
        img.zoom = Math.min(3, Number(img.zoom) + 0.1);
        break;
      case "zoom-out":
        img.zoom = Math.max(0.5, Number(img.zoom) - 0.1);
        break;
      case "left":
        img.x = Number(img.x) - 5;
        break;
      case "right":
        img.x = Number(img.x) + 5;
        break;
      case "up":
        img.y = Number(img.y) - 5;
        break;
      case "down":
        img.y = Number(img.y) + 5;
        break;
      case "rotate":
        img.rotate = (Number(img.rotate) + 90) % 360;
        break;
      case "center":
        img.x = 0;
        img.y = 0;
        img.zoom = 1;
        img.rotate = 0;
        break;
      case "remove":
        images = images.filter((item) => item.id !== selectedId);
        selectedId = null;
        imageEditor.classList.add("hidden");
        break;
      case "done":
        hideEditor();
        return;
      default:
        return;
    }

    renderImages();
  }

  async function handleImages(files) {
    const selectedFiles = Array.from(files || []);
    if (selectedFiles.length === 0) return;

    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) {
      alert(`แนบรูปได้สูงสุด ${MAX_IMAGES} รูป เพื่อให้อยู่ใน A4 หน้าเดียว`);
      imageInput.value = "";
      return;
    }

    const usableFiles = selectedFiles.slice(0, availableSlots);

    try {
      const dataUrls = await Promise.all(usableFiles.map(readFileAsDataUrl));
      dataUrls.forEach((src) => {
        images.push({
          id: uid(),
          src,
          mode: "fit",
          zoom: 1,
          x: 0,
          y: 0,
          rotate: 0
        });
      });

      if (selectedFiles.length > usableFiles.length) {
        alert(`เพิ่มรูปได้อีก ${usableFiles.length} รูปเท่านั้น ระบบจำกัดสูงสุด ${MAX_IMAGES} รูป`);
      }

      renderImages();
    } catch {
      alert("มีไฟล์บางรายการไม่ใช่รูปภาพ หรืออ่านไฟล์ไม่สำเร็จ");
    } finally {
      imageInput.value = "";
    }
  }

  function clearImages() {
    const ok = images.length === 0 || confirm("ต้องการลบรูปทั้งหมดหรือไม่?");
    if (!ok) return;

    images = [];
    selectedId = null;
    renderImages();
  }

  function beforePrint() {
    hideEditor();
    saveForm();
  }

  function bindEvents() {
    loginBtn.addEventListener("click", login);
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") login();
    });

    logoutBtn.addEventListener("click", logout);

    document.querySelectorAll("[data-save]").forEach((el) => {
      el.addEventListener("input", saveForm);
      el.addEventListener("change", saveForm);
    });

    imageInput.addEventListener("change", (event) => handleImages(event.target.files));
    clearImagesBtn.addEventListener("click", clearImages);
    clearFormBtn.addEventListener("click", clearForm);
    printBtn.addEventListener("click", () => {
      beforePrint();
      window.print();
    });

    imageEditor.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-action]");
      if (!btn) return;
      editSelected(btn.dataset.action);
    });

    window.addEventListener("beforeprint", beforePrint);
  }

  function init() {
    loadForm();

    if (!documentCode.value.trim()) {
      documentCode.value = todayDocumentCode();
      saveForm();
    }

    bindEvents();
    renderImages();

    if (localStorage.getItem(AUTH_KEY) === "true") {
      showApp();
    } else {
      showLogin();
    }
  }

  init();
})();
