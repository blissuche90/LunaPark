/*
 * Ipv4 To Int
 *
 * Convert an IPv4 address in the format of null-terminated C string
 * into a integer.  For example, given an IP address "172.168.5.1",
 * the output should be a 32-bit integer with "172" as the highest
 * order 8 bit, 168 as the second highest order 8 bit, 5 as the second
 * lowest order 8 bit, and 1 as the lowest order 8 bit. That is,
 *
 *    "172.168.5.1" => 2896692481
 * 
 * 
 */


/**
 * Throw if any  out of range of [0, 255].
 */
export const outOfRange = new Error(`INPUT ERROR!! INT8 OUT OF RANGE.`);


 /**
  * Throw if input is considered to be not valid due to
  * space location specified in the Requirements.
  */
export const errSpaceBetween = new Error('INPUT ERROR!! Space between two digits.');
 

 /**
  * Throw if input contains a character other than '.', ' ', and '0'~'9'.
  */
export const errInvalidChar = new Error('INPUT ERROR!! Character.');
 
 /**
  * Throw if other error occurs.
  */
export const errOther = new Error('INPUT ERROR!!.')
 
 
 /**
  *
  * We have 4 sections of numbers and 3 DOTs.  Each section has three
  * state: START, MIDDLE, END.  A DOT makes the transition from one
  * section to the next, and is rejected by START.  DIGITs makes the
  * transition from START to MIDDLE but is rejected by END, while SPACE
  * makes the transition from MIDDLE to END but does not affect the
  * other two.
  */
 
 var INIT_SECTION = 0;
 var MAX_SECTION = 3;
 var START = 0;
 var MIDDLE = 1;
 var END = 2;
 
 /**
  * Initial definition for parsing addresses.
  */
 const ipv4FSMInitState = {
 
   sectionNo: INIT_SECTION,
   sectionState: START,
   currentInt8: 0,
   accumulateInt: 0
 
 }
 
 /**
  * Character check transition function.
  * @param {String} c, c.length == 1
  * @throw errInvalidChar
  */
 const checkChar = (c) =>{
   if (c != '.' && c != ' ' &
       !(c >= '0' && c <= '9')) {
     throw errInvalidChar;
   }
 }
 
 /**
  * Digit to Integer
  * @param {String} c, length == 1
  * @return {Int}
  */
 const digit2Int = (c) => {
   return c.charCodeAt(0) - 48;
 }
 
 /**
  * Ipv4 Transition function.
  * @param {String} c, character '.', ' ', or '0'~'9'
  * @param {Object} state
  * @throw outOfRange, errSpaceBetween, errOther
  */
 const ipv4Transition = (c, state) => {
    
   /** 
    * A helper closure just to raise state.accumulateInt and add
    * state.currentInt8 to it.
    *
    * NOTE: Should ONLY be called when state transition from START to MIDDLE,
    * or when parsing finished.
    */
    const accumulate = () => {
      state.accumulateInt =
        state.accumulateInt * 256 + state.currentInt8;
    }


   switch(c) {
 
   case '.': // DOT
     if (state.sectionNo >= MAX_SECTION ||
         state.sectionState == START)
       throw errOther;
     else {
       state.sectionNo ++;
       state.sectionState = START;
       // accumulate();
     }
     break;
 
   case ' ': // SPACE
     if (state.sectionState == START || state.sectionState == END)
       break;
     if (state.sectionState == MIDDLE) {
       state.sectionState ++;
     }
     break;
 
   case null: // null
     if (state.sectionState == START ||
         state.sectionNo != MAX_SECTION)
       throw errOther;
     accumulate();
     break;
 
   default: // DIGIT
     if (state.sectionState == END) {
       throw errSpaceBetween;
     }
     if (state.sectionState == START) {
       accumulate();
       state.sectionState = MIDDLE;
       state.currentInt8 = digit2Int(c);
     } else { // state.sectionState == MIDDLE
       var current = state.currentInt8 * 10 + digit2Int(c);
       if (current > 255)
         throw outOfRange;
       state.currentInt8 = current;
     }
   }
 }
 
 
 
 /**
  * @param {String} address
  * @return {Integer}
  * @throw errOther
  */
 export const IpToInt = (address) =>{
 
   // APOLOGY: I am using JavaScript string, rather than
   // null-terminated C string, as which is asked in the problem
   // description. I just simulated the null-terminated with Javascript
   // 'null'. The C algorithm should be similar. Sorry for this!
 
   var state = Object.assign({}, ipv4FSMInitState);
   
   for (var i = 0; i < address.length; i ++) {
     checkChar(address[i]);
     ipv4Transition(address[i], state);
   }
 
   // simulate null-terminated C string
   ipv4Transition(null, state);
 
   return state.accumulateInt;
 }
 
  console.log(IpToInt('172.168.5.1'));