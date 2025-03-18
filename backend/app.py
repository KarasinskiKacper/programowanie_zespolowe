from flask import Flask, request, render_template
from flask_assets import Environment, Bundle
from datetime import datetime, timedelta

from create_calendar import create_calendar

app = Flask(__name__, template_folder = '../frontend')

assets = Environment(app)
app.static_folder = '../frontend/static'
assets.url = app.static_url_path
sass = Bundle('sass/global.sass','sass/month.sass', 'sass/nav_bar.sass', 'sass/small_calendar.sass', filters=['libsass'], output='all.css')
assets.register('sass_all', sass)

@app.route('/', methods=['GET',"POST"])
def home():
    return app.redirect('/miesiac')
    
@app.route('/miesiac', methods=['GET',"POST"])
def month():
    if request.method == 'GET':
        date = datetime.now()
        
        return render_template('month.html', date = date, create_calendar=create_calendar, offset = 0)
    
@app.route('/tydzien', methods=['GET',"POST"])
def week():
    if request.method == 'GET':
        test = ['test1', 'test2', 'test3']
        return render_template('week.html', test=test)
    

if __name__ == '__main__':
    app.run(debug = True)