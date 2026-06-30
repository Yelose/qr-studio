let qrCode;
let logoDataUrl = "";

window.onload = () => {
    qrCode = new QRCodeStyling({
        width: 297,
        height: 297,
        margin: 0,
    });
    qrCode.append(document.getElementById("qrcode"));
    
    document.getElementById("logo-file").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                logoDataUrl = event.target.result;
                actualizarTodo();
            };
            reader.readAsDataURL(file);
        } else {
            logoDataUrl = "";
            actualizarTodo();
        }
    });

    actualizarTodo();
};

function actualizarTodo() {
    if (!qrCode) return;

    // 1. MARCO MODERNO
    const fSize = document.getElementById("frame-size").value + "px"; 
    const fThickness = document.getElementById("frame-thickness").value + "px"; 
    const fRadius = document.getElementById("frame-radius").value + "px"; 
    const fColor = document.getElementById("frame-color").value;

    ['frame-corner-tl', 'frame-corner-tr', 'frame-corner-bl', 'frame-corner-br'].forEach(id => {
        const corner = document.getElementById(id);
        corner.style.borderColor = fColor;
        corner.style.width = fSize;
        corner.style.height = fSize;
    });

    const tl = document.getElementById('frame-corner-tl');
    tl.style.borderTopWidth = fThickness; tl.style.borderLeftWidth = fThickness; tl.style.borderTopLeftRadius = fRadius;

    const tr = document.getElementById('frame-corner-tr');
    tr.style.borderTopWidth = fThickness; tr.style.borderRightWidth = fThickness; tr.style.borderTopRightRadius = fRadius;

    const bl = document.getElementById('frame-corner-bl');
    bl.style.borderBottomWidth = fThickness; bl.style.borderLeftWidth = fThickness; bl.style.borderBottomLeftRadius = fRadius;

    const br = document.getElementById('frame-corner-br');
    br.style.borderBottomWidth = fThickness; br.style.borderRightWidth = fThickness; br.style.borderBottomRightRadius = fRadius;

    // 2. SIMETRÍA MARCO EXTERIOR DE LOS OJOS
    const ext = document.getElementById("eye-ext").value;
    const int = document.getElementById("eye-int").value;
    const latA = document.getElementById("eye-lata").value;
    const latB = document.getElementById("eye-latb").value;
    const eyeBorderColor = document.getElementById("corners-square-color").value;

    document.getElementById('eye-tl-container').style.borderRadius = `${ext}px ${latA}px ${int}px ${latB}px`;
    document.getElementById('eye-tr-container').style.borderRadius = `${latA}px ${ext}px ${latB}px ${int}px`;
    document.getElementById('eye-bl-container').style.borderRadius = `${latB}px ${int}px ${latA}px ${ext}px`;

    // 3. SIMETRÍA CENTRO DE LOS OJOS
    const iext = document.getElementById("inner-eye-ext").value;
    const iint = document.getElementById("inner-eye-int").value;
    const ilatA = document.getElementById("inner-eye-lata").value;
    const ilatB = document.getElementById("inner-eye-latb").value;
    const eyeDotColor = document.getElementById("corners-dot-color").value;

    // Se apunta al primer elemento hijo (el div interno)
    document.getElementById('eye-tl-container').firstElementChild.style.borderRadius = `${iext}px ${ilatA}px ${iint}px ${ilatB}px`;
    document.getElementById('eye-tr-container').firstElementChild.style.borderRadius = `${ilatA}px ${iext}px ${ilatB}px ${iint}px`;
    document.getElementById('eye-bl-container').firstElementChild.style.borderRadius = `${ilatB}px ${iint}px ${ilatA}px ${iext}px`;

    ['eye-tl-container', 'eye-tr-container', 'eye-bl-container'].forEach(id => {
        const ojo = document.getElementById(id);
        ojo.style.borderColor = eyeBorderColor;
        ojo.firstElementChild.style.backgroundColor = eyeDotColor;
    });

    // 4. ACTUALIZAR MATRIZ
    const dotsType = document.getElementById("dots-type").value;
    const logoSize = parseFloat(document.getElementById("logo-size").value);

    qrCode.update({
        data: document.getElementById("qr-text").value || " ",
        backgroundOptions: { color: document.getElementById("bg-color").value },
        dotsOptions: { type: dotsType, color: document.getElementById("dots-color").value },
        cornersSquareOptions: { type: "square", color: "rgba(0,0,0,0)" }, 
        cornersDotOptions: { type: "square", color: "rgba(0,0,0,0)" },    
        image: logoDataUrl || "",
        imageOptions: {
            crossOrigin: "anonymous", margin: 4, imageSize: logoSize, hideBackgroundDots: true
        },
        qrOptions: { errorCorrectionLevel: "H", typeNumber: 4 }
    });

    auditarPrecision(logoSize, dotsType, parseInt(ext), parseInt(int), parseInt(iext), parseInt(iint));
}

function auditarPrecision(logoSize, dotsType, ext, int, iext, iint) {
    let score = 100;

    if (logoSize > 0.3) score -= (logoSize - 0.3) * 290; 
    if (dotsType === "dots") score -= 6;
    if (dotsType === "classy") score -= 12;
    if (ext > 25 && int > 25) score -= 10;
    if (iext === iint && iext > 10) score -= 5; 

    score = Math.max(5, Math.min(100, Math.round(score)));

    const badge = document.getElementById("precision-badge");
    
    // Inyección de estilos directos para evitar el uso de clases
    if (score >= 90) {
        badge.textContent = `Excelente (${score}%)`; 
        badge.style.backgroundColor = "#def7ec"; 
        badge.style.color = "#03543f";
    } else if (score >= 70) {
        badge.textContent = `Buena (${score}%)`; 
        badge.style.backgroundColor = "#e1effe"; 
        badge.style.color = "#1e429f";
    } else if (score >= 45) {
        badge.textContent = `Inestable (${score}%)`; 
        badge.style.backgroundColor = "#fdf6b2"; 
        badge.style.color = "#723b13";
    } else {
        badge.textContent = `Crítica (${score}%)`; 
        badge.style.backgroundColor = "#fde8e8"; 
        badge.style.color = "#9b1c1c";
    }
}

function descargarQRCompleto() {
    const frameElement = document.getElementById("qr-frame-container");
    html2canvas(frameElement, {
        backgroundColor: null,
        scale: 3
    }).then(canvas => {
        const enlace = document.createElement('a');
        enlace.download = 'yelose-qr-black.png';
        enlace.href = canvas.toDataURL("image/png");
        enlace.click();
    });
}