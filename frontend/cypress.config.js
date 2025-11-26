const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Địa chỉ Frontend của bạn (React chạy cổng nào thì điền cổng đó)
    baseUrl: 'http://localhost:3000', 
    
    setupNodeEvents(on, config) {
      // Nơi cấu hình các plugin hoặc sự kiện lắng nghe (để trống tạm thời)
    },
  },
});