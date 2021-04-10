$(function(){
    
    $('#bdate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1921,
        maxYear: +moment().year(),
        startDate: moment().format('D/M')+'/'+(+moment().year()-21),
        locale: {
            format: "DD/MM/YYYY"
        }
      }, function(start) {
        let years = moment().diff(start, 'years')+1;
        ageval.innerText=years;
      });
    
    // bage.oninput=e=>{
    //     ageval.innerText=bage.value;
    // };
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
    $('.toast-header>close').on('click',e=>$('.toast').toast('hide'));

    // working with firebase
    let DB = firebase.database();
    DB.ref('users/').on('value', snapshot=>{
        const data = snapshot.val();
        // console.log(data);
        let cnt=0, avgAge=0, avgDur=0;
        for(let i in data){
            cnt++;
            avgAge+= +JSON.parse(data[i]).age;
            avgDur+= +JSON.parse(data[i]).time;
        }
        avgAge/=cnt;
        avgDur/=cnt;
        let h=Math.floor(avgDur/60), m=avgDur%60;
        let time=(h?h+' hour ':'') + (m? Math.trunc(m)+' minutes':'');
        dataonserver.innerHTML = `Count : ${cnt} <br /> Average-age : ${+avgAge.toFixed(1)} <br /> Average-party-time : ${time}`;
    })

    // to convert my data to JSON format.
    function jsonData(){
        let data={
            date    : bdate.value,
            age     : ageval.innerText,
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
    myform.onsubmit=e=>{
        let ref = DB.ref('users/'+bname.value);
        ref.set( jsonData() ).then(v=>{
            $('.toast').toast('show');
            // alert(`Thanks ${bname.value}! Your data is saved successfully in Firestore.`)
        }).catch(v=>{
            console.dir(v);
            alert(`Sorry ${bname.value}, Some error occured.`);
        });
        bname.value='';
        return false;
    }

});