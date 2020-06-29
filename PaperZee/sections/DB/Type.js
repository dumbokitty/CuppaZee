import * as React from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import types from 'utils/db/types.json';
import getType from 'utils/db/types';
import categories from 'utils/db/categories.json';
import { TouchableRipple, Chip } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import font from 'sections/Shared/font';
import useMoment from 'utils/hooks/useMoment';
import { useTranslation } from 'react-i18next';
import getIcon from 'utils/db/icon';

function u(str) {
  return str[0].toUpperCase() + str.slice(1)
}

function CustomChip({label,onPress}) {
  return <Chip style={{margin:4}} mode="outlined" textStyle={font()} onPress={onPress}>{label}</Chip>
  // return <View style={{padding:4,margin:4,borderRadius:4,backgroundColor:'white',borderWidth:1,borderColor:"black"}}>
  //   <Text allowFontScaling={false} style={{color:'black'}}>{label}</Text>
  // </View>
}

function getCategory(id) {
  var cat = categories.find(i=>i.id==id) || {};
  // if(cat.parent) {
  //   return `${getCategory(cat.parent)} > ${cat.name}`
  // } else {
    return cat.name;
  // }
}

function checkCanHost(i) {
  return types.find(x=>x.id==i)?.bouncer?.type!=="seasonal"
    || (
      categories.find(y=>y.id==types.find(x=>x.id==i)?.category)?.seasonal
      && categories.find(y=>y.id==types.find(x=>x.id==i)?.category)?.seasonal?.ends>=Date.now()
      && categories.find(y=>y.id==types.find(x=>x.id==i)?.category)?.seasonal?.starts<=Date.now()
    )
}

export default function SettingsScreen() {
  var {t} = useTranslation()
  var moment = useMoment();
  var route = useRoute();
  var munzee_icon = route.params.munzee;
  var munzee = getType(munzee_icon);
  var theme = useSelector(i=>i.themes[i.theme]);
  var nav = useNavigation();
  if(!munzee) return null;
  return (
    <ScrollView style={{ backgroundColor: theme.page_content.bg }} contentContainerStyle={{padding:8}}>
      <View style={{alignItems:"center"}}>
        <Image source={getIcon(munzee.icon)} style={{height:48,width:48}} />
        <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:24,...font("bold")}}>{munzee.name}</Text>
        <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:20,...font("bold")}}>{t('db:type.info',{icon: munzee.icon, id: munzee.id})}</Text>
      </View>
      <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
        {munzee.state!="bouncer"&&<CustomChip label={`${u(munzee.state)}`}/>}
        {munzee.card&&<CustomChip label={`${u(munzee.card)} Edition`}/>}
        {munzee.bouncer&&<CustomChip label="Bouncer"/>}
        {munzee.host&&<CustomChip label="Bouncer Host"/>}
        {munzee.elemental&&<CustomChip label="Elemental"/>}
        {munzee.event=="custom"&&<CustomChip label="Custom Event"/>}
        {munzee.unique&&<CustomChip label="Unique"/>}
        {munzee.destination?.max_rooms&&<CustomChip label={`${munzee.destination?.max_rooms} Rooms`}/>}
        <CustomChip onPress={()=>nav.navigate('DBCategory',{category:munzee.category})} label={`Category: ${getCategory(munzee.category)}`}/>
        {munzee.virtual_colors?.map(i=><CustomChip label={`Virtual Color: ${u(i)}`}/>)}
      </View>
      {categories.find(i=>i.id==munzee.category)?.seasonal&&<View style={{alignItems:"center"}}>
        <Text allowFontScaling={false} style={{color:theme.page_content.fg}}>{moment(categories.find(i=>i.id==munzee.category).seasonal.starts).format('L LT')} - {moment(categories.find(i=>i.id==munzee.category).seasonal.ends).format('L LT')}</Text>
        <Text allowFontScaling={false} style={{color:theme.page_content.fg}}>{t('bouncers:duration',{duration:moment.duration(moment(categories.find(i=>i.id==munzee.category).seasonal.starts).diff(moment(categories.find(i=>i.id==munzee.category).seasonal.ends))).humanize()})}</Text>
      </View>}

      {/* Points */}
      {munzee.points&&<>
        <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
        <View style={{alignItems:"center"}}>
          <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:24,...font("bold")}}>Points</Text>
        </View>
        <View style={{flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
          <View style={{alignItems:"center",padding:4,width:100}}>
            <MaterialCommunityIcons name="account" size={32} color={theme.page_content.fg} />
            <Text allowFontScaling={false} numberOfLines={1} style={{color: theme.page_content.fg,lineHeight:16,fontSize:16,...font("bold")}}>{munzee.points.deploy}</Text>
            <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:12,...font()}}>Deploy</Text>
          </View>
          {!munzee.points.type&&<>
            <View style={{alignItems:"center",padding:4,width:100}}>
              <MaterialCommunityIcons name="check-bold" size={32} color={theme.page_content.fg} />
              <Text allowFontScaling={false} numberOfLines={1} style={{color: theme.page_content.fg,lineHeight:16,fontSize:16,...font("bold")}}>{munzee.points.capture}</Text>
              <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:12,...font()}}>Capture</Text>
            </View>
            <View style={{alignItems:"center",padding:4,width:100}}>
              <MaterialCommunityIcons name="open-in-app" size={32} color={theme.page_content.fg} />
              <Text allowFontScaling={false} numberOfLines={1} style={{color: theme.page_content.fg,lineHeight:16,fontSize:16,...font("bold")}}>{munzee.points.capon}</Text>
              <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:12,...font()}}>Capon</Text>
            </View>
          </>}
          {munzee.points.type=="split"&&<View style={{alignItems:"center",padding:4,width:100}}>
            <MaterialCommunityIcons name="call-split" size={32} color={theme.page_content.fg} />
            <Text allowFontScaling={false} numberOfLines={1} style={{color: theme.page_content.fg,lineHeight:16,fontSize:16,...font("bold")}}>{munzee.points.split} (Min {munzee.points.min})</Text>
            <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:12,...font()}}>Cap/Capon Split</Text>
          </View>}
        </View>
      </>}

      {/* Evo Stages */}
      {munzee.evolution&&<>
        <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
        <View style={{alignItems:"center"}}>
          <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:24,...font("bold")}}>{t('db:type.evo')}</Text>
        </View>
        <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
          {types.filter(i=>i.evolution?.base===munzee.evolution.base).sort((a,b)=>a.evolution?.stage-b.evolution?.stage).map(i=><TouchableRipple onPress={()=>nav.push('DBType',{munzee:i.icon})}>
            <View style={{alignItems:"center",padding:4,width:100}}>
              <Image source={getIcon(i.icon)} style={{height:32,width:32}} />
              <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{color: theme.page_content.fg,fontSize:16,...font("bold")}}>{i.name}</Text>
              <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:16,...font()}}>ID: {i.id}</Text>
            </View>
          </TouchableRipple>)}
        </View>
      </>}

      {/* Pouch Creature Stages */}
      {munzee.bouncer?.base&&<>
        <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
        <View style={{alignItems:"center"}}>
          <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:24,...font("bold")}}>{t('db:type.pouch')}</Text>
        </View>
        <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
          {types.filter(i=>i.bouncer?.base===munzee.bouncer.base).sort((a,b)=>a.bouncer?.stage-b.bouncer?.stage).map(i=><TouchableRipple onPress={()=>nav.push('DBType',{munzee:i.icon})}>
            <View style={{alignItems:"center",padding:4,width:100}}>
              <Image source={getIcon(i.icon)} style={{height:32,width:32}} />
              <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{color: theme.page_content.fg,fontSize:16,...font("bold")}}>{i.name}</Text>
              <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:16,...font()}}>ID: {i.id}</Text>
            </View>
          </TouchableRipple>)}
        </View>
      </>}

      {/* Can Host */}
      {munzee.can_host?.filter?.(checkCanHost)?.length>0&&<>
        <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
        <View style={{alignItems:"center"}}>
          <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:24,...font("bold")}}>{t('db:type.can_host')}</Text>
        </View>
        <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
          {munzee.can_host.filter(checkCanHost).map(i=>types.find(x=>x.id==i)).filter(i=>!i.hidden).map(i=><TouchableRipple onPress={()=>nav.push('DBType',{munzee:i.icon})}>
            <View style={{alignItems:"center",padding:4,width:100}}>
              <Image source={getIcon(i.icon)} style={{height:32,width:32}} />
              <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{color: theme.page_content.fg,fontSize:16,...font("bold")}}>{i.name}</Text>
              <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:16,...font()}}>ID: {i.id}</Text>
            </View>
          </TouchableRipple>)}
        </View>
      </>}

      {/* Lands On */}
      {munzee?.bouncer?.lands_on&&<>
        <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
        <View style={{alignItems:"center"}}>
          <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:24,...font("bold")}}>{t('db:type.lands_on')}</Text>
        </View>
        <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
          {munzee.bouncer.lands_on.map(i=>types.find(x=>x.id==i)).filter(i=>!i.hidden).map(i=><TouchableRipple onPress={()=>nav.push('DBType',{munzee:i.icon})}>
            <View style={{alignItems:"center",padding:4,width:100}}>
              <Image source={getIcon(i.icon)} style={{height:32,width:32}} />
              <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{color: theme.page_content.fg,fontSize:16,...font("bold")}}>{i.name}</Text>
              <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:16,...font()}}>ID: {i.id}</Text>
            </View>
          </TouchableRipple>)}
        </View>
      </>}
      {/* <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
      <View style={{alignItems:"center"}}>
        <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:24,...font("bold")}}>Credits</Text>
      </View>
      <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
        {credits.filter(i=>i.type=="dev").map(i=><TouchableRipple onPress={()=>nav.navigate('UserDetails',{userid:i.user_id})}>
          <View style={{alignItems:"center",padding:4,width:160}}>
            <Image source={{uri:`https://munzee.global.ssl.fastly.net/images/avatars/ua${i.user_id.toString(36)}.png`}} style={{backgroundColor:"white",height:48,width:48,borderRadius:24}} />
            <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:20,...font("bold")}}>{i.username}</Text>
            <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:16,...font()}}>{i.title}</Text>
          </View>
        </TouchableRipple>)}
      </View>
      <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
      <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
        {credits.filter(i=>i.type=="translator").map(i=><TouchableRipple onPress={()=>nav.navigate('UserDetails',{userid:i.user_id})}>
          <View style={{alignItems:"center",padding:4,width:120}}>
            <Image source={{uri:`https://munzee.global.ssl.fastly.net/images/avatars/ua${i.user_id.toString(36)}.png`}} style={{backgroundColor:"white",height:48,width:48,borderRadius:24}} />
            <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:16,...font("bold")}}>{i.username}</Text>
            <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:12,...font()}}>{i.title}</Text>
          </View>
        </TouchableRipple>)}
      </View>
      <View style={{height:1,backgroundColor:theme.page_content.fg,opacity:0.5,margin:8}}></View>
      <Text allowFontScaling={false} style={{color: theme.page_content.fg,fontSize:20,...font("bold"),textAlign:"center"}}>Patrons and Supporters</Text>
      <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
        {credits.filter(i=>i.type=="supporter").map(i=><TouchableRipple onPress={()=>nav.navigate('UserDetails',{userid:i.user_id})}>
          <View style={{alignItems:"center",padding:4,width:100}}>
            <Image source={{uri:`https://munzee.global.ssl.fastly.net/images/avatars/ua${i.user_id.toString(36)}.png`}} style={{backgroundColor:"white",height:36,width:36,borderRadius:18}} />
            <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode='head' style={{color: theme.page_content.fg,fontSize:12,...font("bold")}}>{i.username}</Text>
          </View>
        </TouchableRipple>)}
      </View> */}
    </ScrollView>
  );
}