var today = new Date(); 
var time = today.getMilliseconds()
console.log(time)
const sentences = [
  'my name is sing song',
  'i am a developer',
  'i am happy',
  'you sing like my developer',
  'myself suraj kumar',
];

const ans = [0,0,0,0,0];
const keyword = ['Developer', 'sing', 'song'];
const findSentence = (keyword) => {
  for (i = 0; i < sentences.length; i++) {
    keyword.map((val) => {
      if(sentences[i].includes(val.toLowerCase()))
        ans[i]++;
    });
  }
  ans.sort((a,b)=>b-a)
  console.log(ans)
  console.log(today.getMilliseconds())
};
findSentence(keyword);
