var request = require("request"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    json2csv = require("json2csv"),
    rl = require('readline-sync')
    url = "http://www.bladencc.edu/about-bcc/staff-faculty-directory/";


// var rl = readline.createInterface({
//     input: process.stdin, 
//     output: process.stdout
// });
    

var all_emails = [],
first_names = [],
last_names = [];

var everything = {
    content: []
};

request(url, function(error, res, body){
    if (!error){
        var $ = cheerio.load(body);



        getAll();

        function getAll(){

            var row = $('.staff-list-item');

            row.each(function(i, row){
                
                var thisHref = row.children[2].children[9].attribs.href;
                //have to account for maintenance workers and people without emails listed
                if (thisHref !== "mailto:"){
                    if (!thisHref.substring(7).includes("custodian") && !thisHref.substring(7).includes("maintenance")){
                        var thisName = row.children[0].children[0].data;
                        var thisEmail = thisHref.substring(7);
                        everything.content.push({fullname: thisName, email: thisEmail});
                    }
                }
                
               
                
                
            })


           


            var json = JSON.stringify(everything);

            fs.writeFile('output/json/bladen.json', json, 'utf8');

            var fields = ['fullname', 'email']
            try {
                var result = json2csv({data: everything["content"], fields: fields})
                fs.writeFile('output/csv/bladen.csv', result, 'utf8')
            } catch (err) {
                console.error(err)
            }



        } //getAll

  
        


    }
})