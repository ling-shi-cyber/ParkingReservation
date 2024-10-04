// 模拟已选停车位的状态
let takenSpots = {};

// 表单提交事件
document.getElementById('parkingForm').addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const account = document.getElementById('account').value;
    const VTC = document.getElementById('VTC').value;
    const parkingSpot = document.getElementById('parkingSpot').value;
    const attendees = document.getElementById('attendees').value;

    // 发送数据到后端保存
    fetch('/api/saveParking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            position: position,
            account: account,
            VTC: VTC,
            parkingSpot: parkingSpot,
            attendees: attendees
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('成功报名！');
                fetch('/api/getParking')
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(spot => {
                            // 更新前端显示，禁用已占用的停车位
                            const option = document.querySelector(`#parkingSpot option[value="${spot.spot_number}"]`);
                            if (option) {
                                option.textContent = `停车位 ${spot.spot_number}（已被 ${spot.vtc_name} 占用）`;
                                option.disabled = true;  // 禁用已占用的停车位
                            }
                        });
                    })
                    .catch(error => console.error('获取停车位状态时出错:', error));  // 处理错误
                document.getElementById('parkingForm').reset(); // 清空表单
            } else {
                alert('报名失败');
            }
        })
        .catch(error => console.error('Error:', error));
});

// 页面加载时获取停车位状态
window.onload = function () {
    fetch('/api/getParking')
        .then(response => response.json())
        .then(data => {
            data.forEach(spot => {
                // 更新前端显示，禁用已占用的停车位
                const option = document.querySelector(`#parkingSpot option[value="${spot.spot_number}"]`);
                if (option) {
                    option.textContent = `停车位 ${spot.spot_number}（已被 ${spot.vtc_name} 占用）`;
                    option.disabled = true;  // 禁用已占用的停车位
                }
            });
        })
        .catch(error => console.error('获取停车位状态时出错:', error));  // 处理错误
};



// 轮播图功能
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-images img');

function showNextImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
}

function showPrevImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    images[currentIndex].classList.add('active');
}
