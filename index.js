$(function(){
    
    bage.oninput=e=>{
        ageval.innerText=bage.value;
    };
    bcolor.oninput=e=>{
        colval.innerText=bcolor.value;
    };
    bfrnd.oninput=e=>{
        frndval.innerText=bfrnd.value;
    };
    btime.oninput=e=>{
        let t=btime.value;
        let h=Math.floor(t/60), m=t%60;
        timeval.innerText=(h?h+' hr ':'') + (m?m +' min':'');
    };
    
    // to convert my data to JSON format.
    function jsonData(){
        let data={
            name    : bname.value,
            age     : bage.value,
            color   : bcolor.value,
            friend  : bfrnd.value,
            time    : btime.value,
            pledge  : bpledge.value,
            interest: $('.row input').toArray()
                                     .filter(v=>v.checked)
                                     .map(v=>v.nextElementSibling.innerText)

        };
        return JSON.stringify(data);
    };

    // connecting to firestore and storing data
    
    saveit.onclick=e=>{
        let DB = firebase.database();
        let ref = DB.ref('users/'+bemail.value.substring(0,bemail.value.search('@')));
        ref.set( jsonData() ).then(v=>{
            alert(`Thanks ${bname.value}! Your data is saved successfully in Firestore.`)
        }).catch(v=>{
            console.dir(v);
            alert(`Sorry ${bname.value}, Some error occured.`);
        });
        return false;
    }

});