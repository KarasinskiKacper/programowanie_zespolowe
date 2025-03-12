from flask import Flask, request, render_template
from flask_assets import Environment, Bundle

app = Flask(__name__, template_folder = '../frontend')

assets = Environment(app)
app.static_folder = '../frontend/static'
assets.url = app.static_url_path
sass = Bundle('sass/home.sass', filters=['libsass'], output='all.css')
assets.register('sass_all', sass)

@app.route('/', methods=['GET',"POST"])
def hello():
    if request.method == 'GET':
        return render_template('home.html')

if __name__ == '__main__':
    app.run(debug = True)