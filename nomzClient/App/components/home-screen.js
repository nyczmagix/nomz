var React = require('react-native');

var Button = require('./react-native-button');
var Play = require('./game-play');
var Feed = require('./feed');
var api = require('./utils/api');
var {
  StyleSheet,
  View,
  Text,
  Image,
  NavigatorIOS,
  TouchableOpacity,
  AsyncStorage
} = React;


var Homescreen = React.createClass({
  getInitialState() {
    return {
      isLoading: true,
      isLoggedIn: false,
      user: null,
    }
  },

  // On mount, check for user in Async Storage and update state accordingly
  componentWillMount() {
    AsyncStorage.getItem('userId').then( val => {
      if (!val) {
        this.setState({
          isLoading: false,
          isLoggedIn: false
        })
      } else {
        this.setState({
          isLoading: false,
          isLoggedIn: true,
          user: val
        })
      }
    })
  },


  // componentWillReceiveProps(nextProps) {
  //   console.log('nextProps:', nextProps)
  //   if (nextProps.user) {
  //    //  this.setState({
  //    //      // set something 
  //    // });
  //   }
  // },

  playGame() {
    this.props.navigator.push({
      title: 'Review Dishes',
      component: Play,
      backButtonTitle: ' '
      // backButtonTitle: 'Main Menu'
    });
  },

  goToLogin() {
    this.props.navigator.replace({
      title: 'Login',
      component: require('./Auth/auth'),
      backButtonTitle: ' '
      // backButtonTitle: 'Main Menu'
    });
  },

  goToFeed() {
    this.props.navigator.push({
      title: 'My Feed',
      component: require('./feed'),
      backButtonTitle: 'Home',
      passProps: { user: this.state.user }
    })
  },

  goToProfile() {
    this.props.navigator.push({
      title: 'Profile',
      component: require('./profile/profile'),
      backButtonTitle: 'Home',
      passProps: { user: this.state.user }
    })
  },

  logout() {
    // send logout request
    api.logout().then( res => {
      if (res.status === 200) {
        return AsyncStorage.removeItem('userId')
      }
    }).then( () => {
       // update the state to reflect logged out user
       this.props.user = null;
       this.setState({isLoggedIn: false, user: null});
     }).done()
  },

  render() {
    var authButton;
    var feedButton;
    var profileButton;
    // if user logged in (according to state, render login button)
    if (!this.state.isLoggedIn) {
      authButton = (
        <Button
          style={styles.btn}
          onPress={this.goToLogin}>
          {"Log in"}
        </Button>
      );
      feedButton = <View></View>
      profileButton = <View></View>

    } else { // otherwise, render logout button
        authButton = (
          <Button
            style={styles.btn}
            onPress={this.logout}>
            {"Log Out"}
          </Button>
      ),
        // feedButton = <View></View>
      feedButton = (
        <Button
          style={styles.btn}
          onPress={this.goToFeed}>
          {"My Feed"}
        </Button>
      ),

      profileButton = (
        <Button
          style={styles.btn}
          onPress={this.goToProfile}>
          {'Profile'}
        </Button>
      )

    }
    return (
      <View style={styles.container}>
      <Image source={{ uri: "nomz" , isStatic: true }} style={styles.bgImg} />
        <View style={{ marginTop: 65, backgroundColor: 'transparent' }}></View>
        <View style={styles.box}></View>
        <View style={styles.box}>
          <Button
            style={styles.btn}
            onPress={this.playGame}>
            {"Play Nomz!"}
          </Button>
          { authButton }
          { feedButton }
          { profileButton }
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  box: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems:'center',

  },

  bgImg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.9
  },

  btn: {
    flexDirection: 'row',
    width: 300,
    fontSize: 20,
    color: 'white',
    padding: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#007aff'
  },
})

module.exports = Homescreen;