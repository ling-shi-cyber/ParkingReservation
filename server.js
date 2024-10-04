const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 创建数据库连接
const db = mysql.createConnection({
    host: 'localhost', // 数据库链接（部署在同一服务器上不用改）
    user: 'root', // 数据库用户名（通常为root）
    password: '替换为数据库密码', // 数据库密码
    database: '替换为数据库名称', // 数据库名称
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('已连接到数据库');
});

// 保存停车位占用信息的 API
app.post('/api/saveParking', (req, res) => {
    const { name, position, account, VTC, parkingSpot, attendees } = req.body;

    const query = 'INSERT INTO parking_spots (name, position, account, vtc_name, spot_number, attendees) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, position, account, VTC, parkingSpot, attendees], (err, result) => {
        if (err) {
            console.error('插入数据失败:', err);
            return res.status(500).json({ success: false, message: '插入数据失败' });
        }
        res.json({ success: true });
    });
});

// 获取停车位状态的 API
app.get('/api/getParking', (req, res) => {
    const query = 'SELECT * FROM parking_spots';
    db.query(query, (err, results) => {
        if (err) {
            console.error('获取停车位状态失败:', err);
            return res.status(500).json({ success: false, message: '获取停车位状态失败' });
        }
        res.json(results);
    });
});

// 启动服务器
app.listen(3000, () => {
    console.log('服务器在端口 3000 运行');
});
