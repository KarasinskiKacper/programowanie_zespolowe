from flask import Flask, request, render_template

app = Flask(__name__, template_folder = '../frontend')

@app.route('/', methods=['GET',"POST"])
def hello():
    if request.method == 'GET':
        return render_template('home.html')

if __name__ == '__main__':
    app.run(debug = True)