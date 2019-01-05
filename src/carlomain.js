const carlo = require("carlo");
const path = require("path");

console.log("dirname:", __dirname);

let app;

(async () => {
  // Launch the browser.
  // Added the args options to be able to make requests to apartments.com (CORS and https).
  // If there's a better way to do this, that would be great to find.
  app = await carlo.launch({
    args: ['--allow-running-insecure-content', '--disable-web-security']
  });

  // Terminate Node.js process on app window closing.
  app.on('exit', () => process.exit());

  // Tell carlo where your web files are located.
  app.serveFolder(path.join(__dirname, "../build"));

  // Expose 'env' function + more in the web environment.
  await app.exposeFunction('env', (_) => process.env);
  await app.exposeFunction('reactName', (_) => "index.tsx");

  // Navigate to the main page of your app.
  await app.load('index.html');
})();