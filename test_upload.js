const fs = require('fs');

async function testUpload() {
    const FormData = require('form-data');
    
    // Create a dummy file
    fs.writeFileSync('dummy.jpg', 'fake image content');
    
    const form = new FormData();
    form.append('name', 'Test Product');
    form.append('price', '15000');
    form.append('image', fs.createReadStream('dummy.jpg'));
    
    try {
        const res = await fetch('http://localhost:3000/api/products/5b0fc400-4dec-11f1-ab3b-08979871e6ef', {
            method: 'PUT',
            body: form,
            headers: form.getHeaders()
        });
        const text = await res.text();
        console.log('STATUS:', res.status);
        console.log('RESPONSE:', text);
    } catch(err) {
        console.error(err);
    }
}

testUpload();
