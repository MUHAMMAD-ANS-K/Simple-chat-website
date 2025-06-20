<h1>A simple chat website</h1>
<p>It is operated one on one meaning that there can be only one client at a moment. The user sends a message that will appear in the terminal and the message you write in the terminal will be sent to the clien.</p>
<h2>
  Technologies and Short Description
</h2>
<p>The website uses plain html, css and javascript in the frontend without any external lib in js. A canvas is used to create very beautiful stars to make the animation look beautiful</p>
<p>The website uses fastapi and postgres sql in the backend to manage the requests and store the messages</p>
<p>Postgres needs to be setup locally in order for this to work or if you don't want you can just remove the database connections and the commands. Minimal settings with postgres as localhost and the username and password are hardcoded which can be found in the main.py file or can be adjusted according to needs</p>
<h2>Suggestions and Starting</h2>
<p>First and most basic step will be to create a virtual environment and install the requirements.txt packages so that your app can work.</p>
<p>For better working buy a domain and by using nginx reverse proxy feature, host the site on your machine or an EC2 instance from aws(almost free). After that bind your domain to your machine public ip address and use certbot to generate https certificates so that your website can be https protected and your client will not get any warnings</p>
<p>The last step will be to make the site live by using uvicorn. You can use "uvicorn main:app --host 127.0.0.1 --port 8000".</p>
<p>This website is still under development so stay tuned..</p>
