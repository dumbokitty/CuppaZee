import * as React from 'react'
import { View, Platform, Linking } from 'react-native';
import {
  DrawerContentScrollView,
  // DrawerItem
} from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Text, TouchableRipple, Avatar, IconButton, Menu, Divider, Button, Surface, useTheme, Provider as PaperProvider, TextInput } from 'react-native-paper'
import s from 'utils/store';
import useSearch from 'utils/hooks/useSearch';
import { useDimensions } from '@react-native-community/hooks';
var {mini: miniDispatch} = s;

function DrawerItem(props) {
  const SurfaceOrView = props.focused ? Surface : View;
  const theme = useTheme();
  return <TouchableRipple onPress={props.onPress} style={{
    marginRight: props.mini ? 4 : 8, borderRadius: props.mini ? 48 : 4, opacity: 1 ?? props.style?.opacity ?? (props.focused ? 1 : 1),
    marginLeft: (props.mini ? 4 : 8) + ((props.indent || 0) * 4)
  }}>
    <SurfaceOrView style={{
      padding: 4, borderRadius: props.mini ? 48 : 4, elevation: props.focused ? 8 : 0, flexDirection: "row", alignItems: "center", justifyContent: props.mini ? "center" : "flex-start"
    }}>
      {props.image?<Avatar.Image size={32} source={props.image} />:<Avatar.Icon size={32} icon={props.icon} />}
      {!props.mini && <>
        <View style={{ width: 4 }}></View>
        {typeof props.label == "string" ? <Text numberOfLines={1} ellipsizeMode="tail" allowFontScaling={false} style={{ fontSize: 14, fontWeight: "500" }}>{props.label}</Text> : <props.label color={theme.colors.text} />}
      </>}
    </SurfaceOrView>
  </TouchableRipple>
}

export default function CustomDrawerContent(props) {
  var { width } = useDimensions().window;
  var [helpOpen, setHelpOpen] = React.useState(false);
  var [donateOpen, setDonateOpen] = React.useState(false);
  var [paypalOpen, setPaypalOpen] = React.useState(false);
  var dispatch = useDispatch();
  var mini = props.mini;
  function setMini(value) {
    dispatch(miniDispatch(value));
  }
  var { t } = useTranslation();
  var clanBookmarks = useSelector(i => i.clanBookmarks);
  var userBookmarks = useSelector(i => i.userBookmarks);
  var route = useSelector(i => i.route);
  var nav = props.navigation;
  var [showMoreClan, setShowMoreClan] = React.useState(false);
  var [showMoreUser, setShowMoreUser] = React.useState(false);
  var [search, query, setSearch] = useSearch(300);
  var top = [
    // { title: "Camps Leaderboard", icon: "flag", page: "AllCampWeeks" },
    { title: t(`common:weekly_challenge`), icon: "calendar", page: "WeeklyWeeks" },
  ].filter(i => !i.hide)
  var userPages = [
    // { title: t(`common:maps`), icon: "map", page: "Map" },
    { title: t(`user:activity`), icon: "calendar", page: "UserActivity" },
    { title: t(`user:inventory`), icon: "package", page: "UserInventory" },
    { title: t(`user:your_bouncers`), icon: "star", page: "UserBouncers" },
    { title: t(`user:clan_progress`), icon: "shield-half-full", page: "UserClan" },
  ].filter(i => !i.hide)
  var pages = [
    // { title: t(`common:maps`), icon: "map", page: "Map" },
    { title: t(`common:bouncers`), icon: "map-marker", page: "Bouncers" },
    { title: t(`common:munzee_types`), icon: "database", page: "DBSearch" },
    { title: t(`common:calendar`), icon: "calendar", page: "Calendar" },
    { title: t(`common:evo_planner`), icon: "dna", page: "EvoPlanner" },
    { title: t(`common:scanner`), icon: "qrcode", page: "Scanner", hide: Platform.OS === "web" },
    { title: "Bookmark Manager", icon:"bookmark", page:"Bookmarks" },
  ].filter(i => !i.hide)
  var more = [
    { title: t(`common:notifications`), icon: "bell", page: "Notifications", hide: Platform.OS === "web" },
    { title: t(`common:settings`), icon: "settings", page: "Settings" },
    { title: t(`common:app_info`), icon: "information", page: "Info" },
    { title: `GitHub`, icon: "github-circle", page: "https://github.com/CuppaZee/CuppaZee", link: true }
  ].filter(i => !i.hide)
  var itemProps = {
    side: props.side,
    mini: mini
  }
  const theme = useTheme().drawer;
  return (
    <PaperProvider theme={theme}>
      <Surface style={{ flex: 1, elevation: 0 }}>
        <DrawerContentScrollView showsVerticalScrollIndicator={!mini} {...props}>
          {!mini && <View style={{ paddingVertical: 4, paddingHorizontal: 8 }}>
            <TextInput value={search} mode="outlined" dense={true} left={<TextInput.Icon icon="magnify" />} onChangeText={(val)=>setSearch(val)} label="Search" returnKeyLabel="Search" returnKeyType="search" />
          </View>}
          {query.length > 3 ? <></> : <>
            {/* <View style={{ paddingTop: 8, paddingBottom: 4, paddingLeft: 16 }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, ...font("bold"), opacity: 0.8 }}>Remember this is a{Platform.OS == "android" ? 'n Early Access' : ' Beta'} build</Text>
              <Text allowFontScaling={false} style={{ fontSize: 12, ...font("bold"), opacity: 0.8 }}>Feedback is welcome via Messenger or Email</Text>
            </View> */}
            {!mini && Platform.OS === "web" && globalThis?.navigator?.userAgent?.match?.(/Android/) && <View style={{ paddingTop: 8, paddingBottom: 4, paddingLeft: 8 }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}>The CuppaZee App is now on Google Play</Text>
              <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "bold", opacity: 0.8 }}>Download it now!</Text>
            </View>}
            {!mini && Platform.OS === "web" && globalThis?.navigator?.userAgent?.match?.(/iPhone|iPad|iPod/) && <View style={{ paddingTop: 8, paddingBottom: 4, paddingLeft: 8 }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}>The CuppaZee App is now on the App Store</Text>
              <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: "bold", opacity: 0.8 }}>Download it now!</Text>
            </View>}
            {top.map?.(i => <DrawerItem
              key={i.title}
              {...itemProps}
              style={{ marginVertical: 0, opacity: i.disabled ? 0.6 : 1 }}
              focused={route.name == i.page}
              icon={i.icon}
              label={i.title}
              onPress={i.disabled ? null : (i.link ? () => Linking.openURL(i.page) : () => nav.reset({
                index: 1,
                routes: [
                  { name: '__primary', params: { screen: i.page } },
                ],
              }))
              }
            />)}
            <Divider style={{marginVertical: 4}} />
            {/* {!mini && <View style={{ paddingLeft: 8 }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}>{t(`common:users`)}</Text>
            </View>} */}
            {!mini && <View style={{ paddingHorizontal: 4, flexDirection: "row", justifyContent: "space-between" }}>
              <IconButton
                style={{
                  backgroundColor: route.name == "AllUsers" ? itemProps.activeBackgroundColor : null
                }}
                icon="format-list-bulleted"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "AllUsers" } },
                  ],
                })}
              />
              <IconButton
                style={{
                  backgroundColor: route.name == "UserSearch" ? itemProps.activeBackgroundColor : null
                }}
                icon="magnify"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "UserSearch" } },
                  ],
                })}
              />
              <IconButton
                disabled={true}
                style={{
                  backgroundColor: route.name == "UserRankings" ? itemProps.activeBackgroundColor : null
                }}
                icon="trophy-outline"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "UserRankings" } },
                  ],
                })}
              />
              {/* <IconButton
                disabled={true}
                style={{
                  backgroundColor: route.name == "UserBookmarks" ? itemProps.activeBackgroundColor : null
                }}
                icon="bookmark-outline"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "UserBookmarks" } },
                  ],
                })
                }
              /> */}
            </View>}
            {userBookmarks?.slice?.(0, showMoreUser ? Infinity : userBookmarks.length > 6 ? 5 : 6)?.filter?.(i => i)?.map?.((i, index) => <>
              <DrawerItem
                key={`user_${i.user_id}`}
                {...itemProps}
                style={{ marginVertical: 0 }}
                focused={(route.name?.startsWith?.('User') && (index !== 0 || !userPages.some(p=>p.page===route.name))) && route.params?.username === i.username}
                image={{ uri: i.logo ?? `https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(i.user_id || 0).toString(36)}.png` }}
                label={i.username}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "UserDetails", params: { username: i.username } } },
                  ],
                })
                }
              />
              {(!mini && width > 1000 && index === 0) && userPages.map?.(p => <DrawerItem
                key={p.title}
                {...itemProps}
                style={{ marginVertical: 0 }}
                focused={route.name == p.page}
                indent={1}
                icon={p.icon}
                label={p.title}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: p.page, params: { username: i.username } } },
                  ],
                })
                }
              />)}
            </>)}
            {userBookmarks.length > 6 && <DrawerItem
              {...itemProps}
              style={{ marginVertical: 0 }}
              focused={false}
              icon={showMoreUser ? "chevron-up" : "chevron-down"}
              label={showMoreUser ? t(`common:show_less`) : t(`common:show_more`)}
              onPress={() => setShowMoreUser(!showMoreUser)}
            />}
            {/* <DrawerItem
              {...itemProps}
              style={{ marginVertical: 0 }}
              focused={route.name == "UserSearch"}
              icon={({ focused, color, size }) => <MaterialCommunityIcons name="magnify" color={color} size={24} style={{ margin: 4 }} />}
              label={t(`common:find_user`)}
              onPress={() => nav.reset({
                index: 1,
                routes: [
                  { name: '__primary', params: { screen: "UserSearch" } },
                ],
              })
              }
            /> */}
            <Divider style={{marginVertical: 4}} />
            {/* {!mini && <View style={{ paddingTop: 8, paddingLeft: 8 }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}>{t('common:clan', { count: 2 })}</Text>
            </View>} */}
            {!mini && <View style={{ paddingHorizontal: 4, flexDirection: "row", justifyContent: "space-between" }}>
              <IconButton
                style={{
                  backgroundColor: route.name == "AllClans" ? itemProps.activeBackgroundColor : null
                }}
                icon="format-list-bulleted"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "AllClans" } },
                  ],
                })}
              />
              <IconButton
                style={{
                  backgroundColor: route.name == "ClanSearch" ? itemProps.activeBackgroundColor : null
                }}
                icon="magnify"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "ClanSearch" } },
                  ],
                })}
              />
              {/* <IconButton
                disabled={true}
                style={{
                  backgroundColor: route.name == "ClanRequirements" && route.params.gameid < 87 ? itemProps.activeBackgroundColor : null
                }}
                icon="history"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "ClanRequirements", params: { gameid: 87 } } },
                  ],
                })
                }
              /> */}
              <IconButton
                style={{
                  backgroundColor: route.name == "ClanRequirements" && route.params.year == 2020 && route.params.month == 9 ? itemProps.activeBackgroundColor : null
                }}
                icon="playlist-check"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "ClanRequirements", params: { year: 2020, month: 9 } } },
                  ],
                })
                }
              />
              <IconButton
                style={{
                  backgroundColor: route.name == "ClanRequirements" && route.params.year == 2020 && route.params.month == 10 ? itemProps.activeBackgroundColor : null,
                  borderWidth: 1,
                  borderColor: theme.colors.text
                }}
                icon="star"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "ClanRequirements", params: { year: 2020, month: 10 } } },
                  ],
                })
                }
              />
              {/* <IconButton
                style={{
                  backgroundColor: route.name == "ClanRequirements" && route.params.gameid == 89 ? itemProps.activeBackgroundColor : null
                }}
                icon="new-box"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "ClanRequirements", params: { gameid: 89 } } },
                  ],
                })
                }
              /> */}
              {/* <IconButton
                disabled={true}
                style={{
                  backgroundColor: route.name == "ClanBookmarks" ? itemProps.activeBackgroundColor : null
                }}
                icon="bookmark-outline"
                color={itemProps.inactiveTintColor}
                onPress={() => nav.reset({
                  index: 1,
                  routes: [
                    { name: '__primary', params: { screen: "ClanBookmarks" } },
                  ],
                })
                }
              /> */}
            </View>}
            {clanBookmarks?.slice?.(0, showMoreClan ? Infinity : clanBookmarks.length > 6 ? 5 : 6)?.filter?.(i => i)?.map?.(i => <DrawerItem
              key={`clan_${i.clan_id}`}
              {...itemProps}
              style={{ marginVertical: 0 }}
              focused={route.name == "Clan" && route.params?.clanid == Number(i.clan_id)}
              image={{ uri: i.logo ?? `https://munzee.global.ssl.fastly.net/images/clan_logos/${(i.clan_id || 0).toString(36)}.png` }}
              label={i.name}
              onPress={() => nav.reset({
                index: 1,
                routes: [
                  { name: '__primary', params: { screen: "Clan", params: { clanid: Number(i.clan_id) } } },
                ],
              })
              }
            />)}
            {clanBookmarks.length > 6 && <DrawerItem
              {...itemProps}
              style={{ marginVertical: 0 }}
              focused={false}
              icon={showMoreClan ? "chevron-up" : "chevron-down"}
              label={showMoreClan ? t(`common:show_less`) : t(`common:show_more`)}
              onPress={() => setShowMoreClan(!showMoreClan)}
            />}
            <Divider style={{marginVertical: 4}} />
            {/* {!mini && <View style={{ paddingTop: 8, paddingBottom: 4, paddingLeft: 8 }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}>{t('common:tools')}</Text>
            </View>} */}
            {pages.map?.(i => <DrawerItem
              key={i.title}
              {...itemProps}
              style={{ marginVertical: 0 }}
              focused={route.name == i.page}
              icon={i.icon}
              label={i.title}
              onPress={() => nav.reset({
                index: 1,
                routes: [
                  { name: '__primary', params: { screen: i.page } },
                ],
              })
              }
            />)}
            <Divider style={{marginVertical: 4}} />
            {/* {!mini && <View style={{ paddingTop: 8, paddingBottom: 4, paddingLeft: 8 }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold", opacity: 0.8 }}>{t('common:more')}</Text>
            </View>} */}
            {more.map?.(i => <DrawerItem
              key={i.title}
              {...itemProps}
              style={{ marginVertical: 0, opacity: i.disabled ? 0.6 : 1 }}
              focused={route.name == i.page}
              icon={i.icon}
              label={i.title}
              onPress={i.disabled ? null : (i.link ? () => Linking.openURL(i.page) : () => nav.reset({
                index: 1,
                routes: [
                  { name: '__primary', params: { screen: i.page } },
                ],
              }))
              }
            />)}
            <Menu
              visible={donateOpen}
              onDismiss={() => setDonateOpen(false)}
              anchor={
                <DrawerItem
                  {...itemProps}
                  style={{ marginVertical: 0 }}
                  icon="coin"
                  label={t('common:donate')}
                  onPress={() => setDonateOpen(true)}
                />
              }
            >
              <View style={{ paddingHorizontal: 4, alignItems: "stretch" }}>
                <Button style={{ marginHorizontal: 4 }} color="#F96854" mode="contained" onPress={() => Linking.openURL('https://patreon.com/CuppaZee')} icon="patreon">{t('app_info:patreon_donate')}</Button>
                <Button style={{ marginHorizontal: 4, marginTop: 4 }} color="#29abe0" mode="contained" onPress={() => Linking.openURL('https://ko-fi.com/sohcah')} icon="coffee">{t('app_info:kofi_donate')}</Button>
                <Menu
                  visible={paypalOpen}
                  onDismiss={() => setPaypalOpen(false)}
                  anchor={
                    <Button style={{ marginHorizontal: 4, marginTop: 4 }} color="#009CDE" mode="contained" onPress={() => setPaypalOpen(true)} icon="paypal">{t('app_info:paypal_donate')}</Button>
                  }
                >
                  <View style={{ paddingHorizontal: 8 }}>
                    <Text>{t('app_info:paypal_donate_desc')}</Text>
                  </View>
                </Menu>
              </View>
            </Menu>
            <Menu
              visible={helpOpen}
              onDismiss={() => setHelpOpen(false)}
              anchor={
                <DrawerItem
                  {...itemProps}
                  style={{ marginVertical: 0 }}
                  icon="help-circle"
                  label={t('common:help')}
                  onPress={() => setHelpOpen(true)}
                />
              }
            >
              <View style={{ paddingHorizontal: 4, alignItems: "center" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>{t('common:contact.facebook')} </Text>
                  <TouchableRipple onPress={() => Linking.openURL('https://m.me/CuppaZee')}><Text allowFontScaling={false} style={{ color: theme.colors.text == "#000000" ? 'blue' : 'lightblue', fontSize: 16, fontWeight: "bold" }}>@CuppaZee</Text></TouchableRipple>
                </View>
                <Text allowFontScaling={false} style={{ fontSize: 16 }}>{t('common:contact.email')}</Text>
              </View>
            </Menu>
          </>}
        </DrawerContentScrollView>
        {width > 1000 && <DrawerItem
          {...itemProps}
          style={{ marginVertical: 0, opacity: 1 }}
          icon={mini ? "chevron-right" : "chevron-left"}
          label="Shrink"
          onPress={() => {
            setMini(!mini)
          }}
        />}
      </Surface>
    </PaperProvider>
  );
}