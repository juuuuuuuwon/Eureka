// 이미지 8장. 경로와 이름에 맞게 바꾸어 주심 될듯. 
const IMAGES = [
"img/Book1.jpg","img/Book2.jpg","img/Book3.jpg","img/Book4.jpg",
"img/Book5.jpg","img/Book6.jpg","img/Book7.jpg","img/Book8.png"
];

//  슬롯 포인트 8개 (0~7)
//   - 0: 완전 뒤 (투명)
//   - 1~6: 보이는 카드 영역(6장)
//   - 7: 앞으로 빠지며 사라지는 영역. 6번에서 7번으로 사라지는 애니메이션이라 어차피 최종 보이는건 5장. 
// 카드의 간격은 z값으로 좌우 간격이 되고 X값은 화면에서의 X위치와 같음. 그래서 특정 카드 한장(4)만 위치를 다르게...
const SLOT_POINTS = [
{ x: 790, y:180, z:-2850, rotY:-90 }, // 0 (페이드인 시작)
{ x: 790, y:180, z:-2450, rotY:-90 }, // 1
{ x: 790, y:180, z:-2050, rotY:-90 }, // 2
{ x: 790, y:180, z:-1650,  rotY:-90 }, // 3

{ x: 950, y:180, z:-1250,  rotY:0 }, // 4. 저는 여기를 앞을 보는 카드로 했어요. 최종으로는 크기와 간격 조절 하세요.

{ x: 1090, y:180, z:-850,  rotY:-90 }, // 5
{ x: 1090, y:180, z:-450,  rotY:-90 }, // 6
{ x: 1090, y:180, z:-80,  rotY:-90 }  // 7 (페이드아웃 끝)
];

const NUM_SLOTS = SLOT_POINTS.length; // 8
const NUM_CARDS = NUM_SLOTS;          // 카드 8개
const SPEED = 0.32; // 애니메이션 속도 조절. 낮으면 느려져요.

const wrapper = document.getElementById("cardsWrapper");
const cards = [];

const lerp = (a,b,t)=>a+(b-a)*t; // 이건 중간 단계 러프 해주는 변수로 함수(화살표)로 정의되어있어요.

// 카드 8개 생성
for (let i=0;i<NUM_CARDS;i++){
    const card=document.createElement("div");
    card.className="card";

    const idx=i%IMAGES.length;
    card.dataset.imageIndex=idx;
    card.style.backgroundImage=`url(${IMAGES[idx]})`;

    card._lastS=i;
    wrapper.appendChild(card);
    cards.push(card);
}

let offset=0;
let lastTime=null;

function animate(t){
if(lastTime===null) lastTime=t;
const dt=(t-lastTime)/1000;
lastTime=t;

offset+=dt*SPEED;

cards.forEach((card,i)=>{
    let s=(i+offset)%NUM_SLOTS;
    if(s<0) s+=NUM_SLOTS;

    const base=Math.floor(s);
    const next=(base+1)%NUM_SLOTS;
    const tval=s-base;

    const p0=SLOT_POINTS[base];
    const p1=SLOT_POINTS[next];

    const x=lerp(p0.x,p1.x,tval);
    const y=lerp(p0.y,p1.y,tval);
    const z=lerp(p0.z,p1.z,tval);
    const rotY=lerp(p0.rotY,p1.rotY,tval);

    // ----------------------------
    // ✔ 새 투명도 규칙 (5장 보임)
    // s: 0~1 → 0→1
    // s: 1~6 → 1
    // s: 6~7 → 1→0
    // ----------------------------
    let opacity=0;
    if(s<1){
    opacity=s;          // 0 → 1
    }else if(s<6){
    opacity=1;          // 항상 보임(5장)
    }else if(s<7){
    opacity=1-(s-6);    // 1 → 0
    }else{
    opacity=0;
    }

    card.style.opacity=opacity.toFixed(3);
    card.style.transform=
    `translate3d(${x}px,${y}px,${z}px) rotateY(${rotY}deg)`;

    // 이미지 교체: 7 → 0 넘어갈 때
    const lastS = card._lastS % NUM_SLOTS;
    if(lastS>7-0.1 && s<0.5){
    let idx=parseInt(card.dataset.imageIndex);
    idx=(idx)%IMAGES.length;
    console.log(idx);
    card.dataset.imageIndex=idx;
    card.style.backgroundImage=`url(${IMAGES[idx]})`;
    }

    card._lastS=s;
});

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

