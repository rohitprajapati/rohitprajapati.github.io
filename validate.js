//*VALIDATION FOR QUICK CONTACT FORM*//

function validate()
{
 if(document.feedback.txtname.value.search(/^[A-Za-z]/)==-1)
	   
	   {
		  alert("You're trying to send an Empty Email. Please type something and then get on your way.");
		  document.feedback.txtname.select();
		  document.feedback.txtname.focus();
		   return(false);
	   }
	   
	    
	   
	    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(document.feedback.txtemail.value))) {
		  alert("You're trying to send an Empty Email. Please type something and then get on your way.");
		  document.feedback.txtemail.select();
		  document.feedback.txtemail.focus();
		    return(false);
	   }
	   
	   
	
	   if(document.feedback.ph.value == 0)
	   {
		  alert("You're trying to send an Empty Email. Please type something and then get on your way.");
		  document.feedback.ph.select();
		  document.feedback.ph.focus();
		  
		  return false;
	   }
	

	   
	   
	   if(document.feedback.message.value == 0)
	   
	   {
		  alert("You're trying to send an Empty Email. Please type something and then get on your way.");
		  document.feedback.message.select();
		  document.feedback.message.focus();
		   return(false);
	   }
	   
	     
	  	   
	   {
		   
	   return true;
}

}

function resetForm()
{
alert("Do you want to reset value");	
document.feedback.txtname.value= ""	
document.feedback.txtemail.value= ""	
document.feedback.spam.value= ""	
document.feedback.message.value= ""
}









function stopspam(){
	val = document.getElementById("spam").value;
	if(val!="37") {
		alert("Please, enter sum correctly!");
		document.feedback.spam.select();
		document.feedback.spam.focus();
		return false;
	} else {
		return true;
	}
}


//*VALIDATION CLOSE HERE/