from flask import Flask, json, jsonify, request, send_file, flash, redirect, url_for
from flask_cors import CORS, cross_origin
import mysql.connector
import json
import shutil
import os
from werkzeug.utils import secure_filename

api = Flask(__name__)
CORS(api)

configPath = "C:\\Users\\B147258369\\Desktop\\CESI_innovation\\L3RNE-Boilerplate\\src\\config.json"


@api.route('/ping', methods=['GET'])
def ping():
    msg = "L'api est fonctionnelle !"
    return msg


@api.route('/getharddiskusage', methods=['GET'])
def hardDiskUsage():
    with open(configPath, "r") as f:
        data = json.load(f)

    json_data = '{"usage":['

    for i in range(len(data["path"])):
        total, used, free = shutil.disk_usage(data["path"][i])
        totalGB = total // (2 ** 30)
        usedGB = used // (2 ** 30)
        freeGB = free // (2 ** 30)
        json_data = json_data + '{"total":"' + str(totalGB) + '","used":"' + str(usedGB) + '","free":"' + str(
            freeGB) + '"},'
        if i == len(data["path"]) - 1:
            json_data = json_data + '{"total":"' + str(totalGB) + '","used":"' + str(usedGB) + '","free":"' + str(
                freeGB) + '"}]}'

    return jsonify(json_data)


@api.route('/getfoldercontent', methods=['GET'])
def getFolderContent():
    returnValue = '{{"content":"undefined"}}'
    content = []
    folder = request.args.get('folder')
    if folder != "undefined":
        for x in os.listdir(folder):
            content.append(x)

        returnValue = json.dumps(content)
    else:
        returnValue = '{{"content":"undefined"}}'

    return returnValue


@api.route('/download', methods=['GET'])
def downloadFile ():
    path = request.args.get('path')

    return send_file(path, as_attachment=True)


@api.route('/upload', methods=['GET','POST'])
def fileUpload():
    UPLOAD_FOLDER = request.args.get('path')
    target = os.path.join(UPLOAD_FOLDER, '')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file']
    filename = secure_filename(file.filename)
    destination = "/".join([target, filename])
    file.save(destination)
    response = "Whatever you wish too return"
    return response


@api.route('/mkdir', methods=['POST'])
def mkdir():
    returnValue = "True"
    rqt = request.get_json()
    path = rqt["path"]

    # define the access rights
    access_rights = 0o777

    try:
        os.mkdir(path, access_rights)
    except OSError:
        returnValue = "False"
    else:
        returnValue = "True"

    return returnValue


@api.route('/login', methods=['POST'])
def login():
    returnValue = ""
    user = request.get_json()
    username = user["username"]
    password = user["password"]
    dbUser = selectDb("SELECT COUNT(*) FROM user ")

    if dbUser[0][0] == 0:
        # Il n'y a pas de user en bdd.
        returnValue = "go register"
    else:
        # Il y a un user en bdd.
        dbPassword = selectDb("SELECT password from user where username = '{}'".format(user["username"]))
        # Il n'y a qu'un seul user ==> s'il y a un retour c'est que le password est correcte.

        if len(dbPassword) != 0:
            if dbPassword[0][0] == user["password"]:
                returnValue = "True"
            else:
                returnValue = "False"
        else:
            returnValue = "False"

    return returnValue


@api.route('/register', methods=['POST'])
def register():
    returnValue = ""
    user = request.get_json()
    username = user["username"]
    password = user["password"]
    dbUser = selectDb("SELECT COUNT(*) FROM user ")

    if dbUser[0][0] == 0:
        # Il n'y a pas de user en bdd.
        execDb("INSERT INTO user (username, password) VALUES('{}','{}')".format(user["username"], user["password"]))
        returnValue = "True"
    else:
        # Il y a un user en bdd.
        returnValue = "go login"

    return returnValue


@api.route('/trombinoscope', methods=['GET'])
def getAllTrombinoscope():
    return jsonify(selectDb(
        "SELECT trombinoscope.id, nom_eleve,prenom_eleve,photo, nom,annee FROM trombinoscope INNER JOIN promotion ON promotion.id = trombinoscope.id_promotion order by id_promotion"))


@api.route('/trombinoscope/<id>', methods=['GET'])
def selTrombinoscopebyId(id):
    return jsonify(selectDb("SELECT * from trombinoscope where id = {}".format(id)))


@api.route('/trombinoscope/new', methods=['POST'])
def add_trombinoscope():
    trombi = request.get_json()
    execDb(
        "INSERT INTO trombinoscope (nom_eleve, prenom_eleve, photo, id_promotion) VALUES('{}','{}','{}','{}')".format(
            trombi["nom"], trombi["prenom"], trombi["photo"], trombi["id_promotion"]))
    return trombi


@api.route('/trombinoscope/delete/<id>', methods=['GET'])
def delTrombinoscopebyId(id):
    execDb("DELETE from trombinoscope where id = {}".format(id))
    return jsonify(selectDb("SELECT * from trombinoscope"))


@api.route('/trombinoscopre/update/<id>', methods=['POST'])
def updateTrombinoscopebyId(id):
    trombi = request.get_json()
    execDb("UPDATE trombinoscope SET nom_eleve='" + trombi['nom_eleve'] + "', prenom_eleve='" + trombi[
        'prenom_eleve'] + "', photo='" + trombi['photo'] + "', id_promotion='" + trombi[
               'id_promotion'] + "' where id = {}".format(id))
    return trombi


@api.route('/publication', methods=['GET'])
def getAllPublication():
    return jsonify(selectDb("SELECT * from publication"))


@api.route('/publication/<id>', methods=['GET'])
def selPublicationById(id):
    return jsonify(selectDb("SELECT * from publication where id = {}".format(id)))


@api.route('/publication/new', methods=['POST'])
def add_publi():
    publi = request.get_json()
    execDb("INSERT INTO publication (titre, texte, date) VALUES('{}','{}','{}')".format(publi["titre"], publi["texte"],
                                                                                        publi["date"]))
    return publi


@api.route('/publication/delete/<id>', methods=['GET'])
def delPublicationbyId(id):
    execDb("DELETE from publication where id = {}".format(id))
    return jsonify(selectDb("SELECT * from publication"))


@api.route('/publication/update/<id>', methods=['POST'])
def updatePublicationbyId(id):
    publi = request.get_json()
    execDb("UPDATE publication SET titre='" + publi['titre'] + "', texte='" + publi['texte'] + "', date='" + publi[
        'date'] + "' where id = {}".format(id))
    return publi


@api.route('/evenement', methods=['GET'])
def getAllEvent():
    return jsonify(selectDb("SELECT * from evenement"))


@api.route('/evenement/<id>', methods=['GET'])
def selEvenementbyId(id):
    return jsonify(selectDb("SELECT * from evenement where id = ", id))


@api.route('/evenement/new', methods=['POST'])
def add_eve():
    event = request.get_json()
    execDb("INSERT INTO evenement (nom, date, description) VALUES('{}','{}','{}')".format(event["nom"], event["date"],
                                                                                          event["description"]))
    return "True"


@api.route('/evenement/delete/<id>', methods=['GET'])
def delEvenementbyId(id):
    execDb("DELETE from evenement where id = {}".format(id))
    return jsonify(selectDb("SELECT * from evenement"))


@api.route('/evenement/update/<id>', methods=['POST'])
def updateEvenementbyId(id):
    event = request.get_json()
    execDb("UPDATE evenement SET nom='" + event['nom'] + "', date='" + event['date'] + "', description='" + event[
        'description'] + "' where id = {}".format(id))
    return event


@api.route('/promotion', methods=['GET'])
def getAllPromotion():
    return jsonify(selectDb("SELECT * from promotion"))


@api.route('/promotion/<id>', methods=['GET'])
def selPromotionbyId(id):
    return jsonify(selectDb("SELECT * from promotion where id = {}".format(id)))


@api.route('/promotion/new', methods=['POST'])
def add_promo():
    promo = request.get_json()
    execDb("INSERT INTO promotion (nom, annee) VALUES('{}','{}')".format(promo["nom"], promo["annee"]))
    return promo


@api.route('/promotion/update/<id>', methods=['POST'])
def updatePromotionbyId(id):
    promo = request.get_json()
    execDb("UPDATE promotion SET nom='" + promo['nom'] + "', annee='" + promo['annee'] + "' where id = {}".format(id))
    return promo


@api.route('/promotion/delete/<id>', methods=['GET'])
def delPromotionbyId(id):
    execDb("DELETE from promotion where id = {}".format(id))
    return jsonify(selectDb("SELECT * from promotion"))


def execDb(query):
    mydb = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        passwd="",
        database="raspnas"
    )
    mycursor = mydb.cursor()
    mycursor.execute(query)
    mydb.commit()
    mycursor.close()
    mydb.close()


def selectDb(query):
    mydb = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        passwd="",
        database="raspnas"
    )
    mycursor = mydb.cursor()
    mycursor.execute(query)
    res = mycursor.fetchall()
    mycursor.close()
    mydb.close()
    return res


if __name__ == "__main__":
    api.run(host='0.0.0.0')
