
import numeral from "numeral"
export const HTML = (data = [], client = "", totaleLettre = "", type = 'facture', ref = 0) => {
    const transCurrency = (n) => {
        return numeral(n).format('0,0.000');
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '/' + mm + '/' + yyyy;
    let generatedTable = ``;
    let ttb = 0
    let ttn = 0
    let ttt = 0
    let tt = 0
    data.forEach(element => {
        generatedTable += `
                <tr>
                    <td style='font-size:.7em;'>${element.refC}</td>
                    <td style='font-size:.8em;'>${element.composant}</td>
                    <td>${element.quantity}</td>
                    <td>${transCurrency(element.prix)}</td>
                    <td>${element.remise}%</td>
                    <td id="tt">${transCurrency(element.prix * element.quantity - element.prix * element.remise / 100)}</td>
                    <td>${element.tva}%</td>
                </tr>
        `
        ttb += (element.prix * element.quantity)
        ttt += (element.prix * element.tva) / 100
        ttn += (element.prix * element.quantity - element.prix * element.remise / 100)
    });

    tt = ttn + ttt
    return (
        `
    <body>
    <style type="text/css">
        body{
            font-size: .9em;
        }
        #table {
            width: 100%;
            color: #717375;
            font-family: helvetica;
            line-height: 5mm;
            border-collapse: collapse;
        }

        h2 {
            margin: 0;
            padding: 0;
        }

        p {
            margin: 5px;
        }

        .border th {
            border: 1px solid #000;
            color: white;
            background: #000;
            padding: 5px;
            font-weight: normal;
            font-size: 14px;
            text-align: center;

        }

        .border td {
            border: 1px solid #CFD1D2;
            padding: 5px 10px;
            text-align: center;
        }

        .no-border {
            border-right: 1px solid #CFD1D2;
            border-left: none;
            border-top: none;
            border-bottom: none;
        }

        .space {
            padding-top: 50px;
        }

        .p10 {
            width: 10%;
        }

        .p15 {
            width: 15%;
        }

        .p25 {
            width: 25%;
        }

        .p50 {
            width: 50%;
        }

        .p60 {
            width: 60%;
        }

        .p75 {
            width: 75%;
        }

        #invoice {
            padding: 30px;
            padding-top: 0px !important;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #717375;
            font-family: helvetica;
            line-height: 5mm;
            border-collapse: collapse;
        }
        
        #prix {
            width: 40%;
            margin-left: auto;
            margin-top: 10px;
            border: 1px solid #000000;
            border-collapse: collapse;
        }
        #prix td{
            border: 1px solid #CFD1D2;
            padding: 5px;
            text-align: center;
        }

        #info-g {
            color: black;
        }

        #info-g span {
            font-weight: bold;
            font-size: 15px;
            display: inline-block;
            width: 80px;
        }

        .names {
            font-size: .9em;
        }

        #name {
            border: solid 1px #8c8c8c;
            padding: 60px;
            border-radius: 15px;
        }
    </style>
    <div id="invoice">
    <header>
    <div>
        <div id="info-g">
            <div style="display: flex; justify-content: space-between;width: 400%;">
                <h1 style="color: #717375;">
                    EHTE
                </h1>
                <p style="font-size: 1.3em;color: #717375;margin-bottom: 10px;line-height: 1.1em;">Société
                    Hannachi Chouaib.<br />Travaux électriques générale</p>
                <p style="line-height:25px;">
            </div>
            Cité L'indépendance 6120, krib siliana <br /><span>Tel:</span> 58 130 838 <br />
            <div style="display: inline;position: relative;left: 80px;">
                - 90 614 146
            </div> <br /><span>Fax:</span> 78 895 036<br />
            <span>email:</span> Hannachicc@gmail.com<br />
            <span>Matricule fiscale:</span> 1658427/J
            </p>
        </div>
    </div>
    <div id="name">
        <h2>${client}</h2>
    </div>
</header>

        <table style="margin-top: 30px;" id="table">
            <tr>
                <td class="p50">
                    <h2>${type} N° R-20${ref}S${ref+dd}</h2>
                </td>
                <td class="p50" style="text-align: right;">
                    <strong>Emis le ${today} </strong>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 15px;" colspan="2"> </td>
            </tr>
        </table>

        <table style="margin-top: 30px;" id="table">
            <thead class="border">
                <tr>
                    <th class="p10">Réference</th>
                    <th class="p60">Désignation</th>
                    <th class="p10">Quantité</th>
                    <th class="p15">Prix Unitaire HT</th>
                    <th class="p10">Remise</th>
                    <th class="p15">Montant HT</th>
                    <th class="p10">TVA</th>
                </tr>
            </thead>
            <tbody class="border">
                ${generatedTable}
            </tbody>

        </table>
        
        <table id="prix">
            <tr>
                <td rowspan="2">
                    Totale
                </td>
                <td>
                    HT
                </td>
                <td>
                    TVA
                </td>
                <td style="font-weight: bold;">
                    TTC
                </td>
            </tr>
            <tr>
                <td>
                    ${transCurrency(ttn)}
                </td>
                <td>
                    ${transCurrency(ttt)}
                </td>
                <td style="font-weight: bold;">
                    ${transCurrency(tt)}
                </td>
            </tr>

        </table>
        <p style="text-align: right; margin-top: 30px; margin-right: 30px;">
        Arrêtée la présente facture à la somme de: <br/>
            <strong>
                ${totaleLettre} 
            </strong>
        </p>
    </div>
</body>

    `
    )
}