function popup() {

  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");

  // Toggle chatbot visibility
  chatbotToggler?.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
  });

  // Close chatbot
  closeBtn?.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
  });




const text = "ERROR";
const baseStyle = "font-size: 100px; font-weight: bold; background-color: black; padding: 5px; border-radius: 5px;"; // สไตล์พื้นฐานเหมือนเดิม
const rainbowColors = [
    "color: red;",
    "color: orange;",
    "color: yellow;",
    "color: green;",
    "color: blue;",
    "color: indigo;",
    "color: violet;"
];

let colorOffset = 0; // ตัวแปรสำหรับเลื่อนสี
let animationInterval; // ตัวแปรสำหรับเก็บ ID ของ interval เพื่อให้เราหยุดได้

function animateRainbowText() {
    console.clear(); // ล้าง console ก่อนแสดงผลเฟรมใหม่

    let formatString = "";
    const stylesArray = [];

    for (let i = 0; i < text.length; i++) {
        formatString += "%c" + text[i];
        // คำนวณ index ของสีโดยใช้ colorOffset เพื่อให้สีเลื่อนไปเรื่อยๆ
        const colorIndex = (i + colorOffset) % rainbowColors.length;
        const charColorStyle = rainbowColors[colorIndex];
        stylesArray.push(charColorStyle + baseStyle);
    }

    console.log(formatString, ...stylesArray);

    colorOffset++; // เพิ่มค่า offset เพื่อให้สีเปลี่ยนไปในเฟรมถัดไป
    if (colorOffset >= rainbowColors.length) {
        colorOffset = 0; // วนกลับมาที่สีแรกเมื่อครบทุกสี
    }
}

// เริ่มการทำงานของ animation
// คุณสามารถปรับความเร็วได้โดยเปลี่ยนตัวเลข 200 (หน่วยเป็นมิลลิวินาที)
// เช่น 100 จะเร็วขึ้น, 500 จะช้าลง
animationInterval = setInterval(animateRainbowText, 200);

// หากต้องการหยุด animation ให้พิมพ์คำสั่งนี้ใน console:
// clearInterval(animationInterval);
// หรือ
// stopAnimation();

// ฟังก์ชันสำหรับหยุด animation (เผื่อเรียกใช้ง่ายๆ)
function stopAnimation() {
    clearInterval(animationInterval);
    console.log("Animation stopped.");
}


}
export default popup;