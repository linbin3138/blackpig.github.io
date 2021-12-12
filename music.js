function $(id){
  return document.getElementById(id);
}
function Searchtext(){
  if(window.event.keyCode==13){
    searchMusic();
  }
}
function sortRule(a, b) { //设置一下排序规则
  return a.time - b.time;
}
var songid = new Array();
var lyric=new Array();
function searchMusic(){//查询歌曲
      var str = document.getElementById("inputsearch").value;
      if(!str){
        alert("搜索框不能为空！")
      }else{
        axios.get('http://localhost:3000/search?keywords=' + str)
        .then(response => {
            let songs=response.data.result.songs;
            setSongslist(songs);
        })
      }
}
function setSongslist(songs){
      let info="";
      var songlen=songs.length;
      songid.length=0;
      info+=`<tr>
                <th></th>
                <th>歌名</th>
                <th>歌手</th>
            </tr>`;
      for(let i=0;i<songlen;i++){
        songid.push(songs[i].id);
        if(i%2==0){
          info+=`<tr>
            <td><a href="#" style="width:24px;height:24px" onclick="playmusic(${i});"><img src="/网易云/images/小播.png"></img></a></td>
            <td class="td1" id=song${i}>${songs[i].name}</td>
            <td class="td1">${songs[i].artists[0].name}</td>
            </tr>`;
        }
        if(i%2!=0){
          info+=`<tr>
            <td><a href="#" style="width:24px;height:24px" onclick="playmusic(${i});"><img src="/网易云/images/小播.png"></img></a></td>
            <td class="td2" id=song${i}>${songs[i].name}</td>
            <td class="td2">${songs[i].artists[0].name}</td>
            </tr>`;
        }
      }
      document.getElementById('songlist').innerHTML=info; 
}

function playmusic(i){
      var songurl;
      var id=songid[i];
      axios.get('http://localhost:3000/song/url?id='+id)
      .then(response =>{
        songurl=response.data.data[0].url
        var audio=document.getElementById('song');
        audio.src=songurl;
        
        getlyric(id);
      });
}
function getlyric(id){
      let lyricstr="";
      axios.get('http://localhost:3000/lyric?id='+id)
      .then(response =>{
        lyricstr=response.data.lrc.lyric;
        if(lyricdiv.children!=null){
          lyricdiv.innerHTML='';
        }
        showlyric(lyricstr);
      });
}
function showlyric(lyricstr){
      let musicArea = document.createElement('div');
      let music = song;
      let musicUl =document.createElement('ul');
      let a = 650;
      let b = 30;
      let c = music.src;
      lyricdiv.appendChild(musicArea);
      musicArea.appendChild(musicUl);
      musicStyle();
      let lrc = lyricstr;
  function musicStyle(){//控件css样式；	
        musicArea.style.width ='100%';
        musicArea.style.height ='100%';
        musicArea.style.overflow = 'hidden'
        // musicArea.style.outline ='3px solid'
        musicUl.style.listStyle ='none'; 
        musicUl.style.width ='100%'
        musicUl.style.padding  ='0';
        musicUl.style.transition = '0.3'
  }
//把歌词变成[{time,lrc},{time,lrc}...]的样子，不然没法用的
  function split(){//把lrc歌词分割成数组，
        let split_1 =lrc.split('\n');
        let length = split_1.length;
        for (let i = 0; i < length; i++) {
          let lrcArr = split_1[i];
          split_1[i] = change(lrcArr);
        function change(str){
          let lrc = str.split(']');
          let timer =lrc[0].replace('[','');
          let str_music =lrc[1];
          let time_split =timer.split(':');
          let s = +time_split[1];
          let min = +time_split[0];
          return{
            time:min*60 + s ,
            lrc:str_music//分割好到歌词和时间
          }    
        }
      }
      return split_1
  }
  let lrcArr = split();
  createLi();
  function createLi(){//根据歌词数组创建li
        let len = lrcArr.length;
        for (let i = 0; i < len; i++) {
            let lrc_li  = lrcArr[i];
            let li  = document.createElement('li');
            li.innerText =lrc_li.lrc;
            li.style.height = b + 'px'
            li.style.textAlign ='center'
            li.style.width='100%'
            li.style.padding = '0';
            li.style.color = '#999'
            li.style.transition = '0.3'
            musicUl.appendChild(li);
        }
  }
  function setCurrentLi(){
        let time = music.currentTime;
        for ( i = 0; i < lrcArr.length; i++) {
          let play = lrcArr[i];
          console.log(play.time);
          if (time -play.time <= 0) {
              return i;
          }
        }return -1;
  }
  function current(){//设置top，让其滚动
          let li = setCurrentLi();
          let divHeight = a;
          let liHeight =b;
          let top  = liHeight*li - divHeight / 2 +liHeight / 2;
          if (top < 0) {
            top = 0;
          }
          musicUl.style.marginTop = -top + 'px';
          // console.log('top'+top);
          let playLi =musicUl.querySelector('.play');
          if (playLi) {
            playLi.className = '';		
          }
          if(li>=0){
            musicUl.children[li-1].className ='play';
          }
  }
    music.ontimeupdate = current;
}

