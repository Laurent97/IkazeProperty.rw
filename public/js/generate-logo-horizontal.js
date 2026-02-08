const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create gradient background
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#1e40af');
gradient.addColorStop(0.5, '#3b82f6');
gradient.addColorStop(1, '#06b6d4');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw house icon
ctx.fillStyle = '#ffffff';
ctx.beginPath();
const houseX = canvas.width * 0.1;
const houseY = canvas.height * 0.2;
const houseSize = Math.min(canvas.width, canvas.height) * 0.6;

// House body
ctx.fillRect(houseX, houseY + houseSize * 0.4, houseSize, houseSize * 0.6);

// Roof
ctx.beginPath();
ctx.moveTo(houseX - houseSize * 0.1, houseY + houseSize * 0.4);
ctx.lineTo(houseX + houseSize * 0.5, houseY);
ctx.lineTo(houseX + houseSize * 1.1, houseY + houseSize * 0.4);
ctx.closePath();
ctx.fill();

// Text
ctx.fillStyle = '#ffffff';
ctx.font = '15px "Segoe UI", Arial, sans-serif';
ctx.fontWeight = 'bold';
ctx.fillText('Ikaze', houseX + houseSize + 10, houseY + houseSize * 0.6);

if (canvas.height > 40) {
  ctx.font = '10px "Segoe UI", Arial, sans-serif';
  ctx.fontWeight = 'normal';
  ctx.fillText('Property', houseX + houseSize + 10, houseY + houseSize * 0.8);
}

// Download the image
canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logo-horizontal.png';
    a.click();
    URL.revokeObjectURL(url);
});
