const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');
const logoSelect = document.getElementById('logoSelect');
const colorPicker = document.getElementById('colorPicker');
const patternSelect = document.getElementById('patternSelect');
const exportPNG = document.getElementById('exportPNG');
const exportJPEG = document.getElementById('exportJPEG');

const logos = {
    nba: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="black" stroke-width="5"/>
            <path d="M30 50 Q50 25 70 50 Q50 75 30 50" fill="none" stroke="black" stroke-width="5"/>
        </svg>
    `,
    nfl: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="black" stroke-width="5"/>
            <line x1="5" y1="50" x2="95" y2="50" stroke="black" stroke-width="5"/>
        </svg>
    `,
    mlb: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="black" stroke-width="5"/>
            <path d="M50 5 C 20 30, 20 70, 50 95 C 80 70, 80 30, 50 5" fill="none" stroke="black" stroke-width="5"/>
        </svg>
    `
};

function drawLogo() {
    const svgString = logos[logoSelect.value];
    const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const img = new Image();
    
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        applyColorAndPattern();
    };
    
    img.src = url;
}

function applyColorAndPattern() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const color = hexToRgb(colorPicker.value);

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
            data[i] = color.r;
            data[i + 1] = color.g;
            data[i + 2] = color.b;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    if (patternSelect.value !== 'none') {
        applyPattern(patternSelect.value);
    }
}

function applyPattern(pattern) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';

    if (pattern === 'stripes') {
        for (let i = 0; i < canvas.width; i += 10) {
            ctx.fillRect(i, 0, 5, canvas.height);
        }
    } else if (pattern === 'dots') {
        for (let i = 0; i < canvas.width; i += 20) {
            for (let j = 0; j < canvas.height; j += 20) {
                ctx.beginPath();
                ctx.arc(i, j, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    ctx.restore();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function exportImage(format) {
    const link = document.createElement('a');
    link.download = `remixed_logo.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
}

logoSelect.addEventListener('change', drawLogo);
colorPicker.addEventListener('input', applyColorAndPattern);
patternSelect.addEventListener('change', drawLogo);
exportPNG.addEventListener('click', () => exportImage('png'));
exportJPEG.addEventListener('click', () => exportImage('jpeg'));

drawLogo();