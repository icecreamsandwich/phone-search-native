/* @flow */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  FlatList,
  Picker
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Slider } from 'react-native-elements';

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      brandName: "",
      priceRange: 200,
      brand: "",
      showBrand:false,
      isLoading:true
    };
  }

  setBgColor() {
    return {
      borderRadius: 12,
      backgroundColor: "green",
  }
}

//call the API to fetch Data
componentdidMount(){
    fetch('http://localhost/gsmarena-API/api/?action=brands')
      .then(response => response.json())
      .then(res => this.setState({ brands:res.data }));
      this.setState({isLoading:false})
  }

  handleButtonPress() {
         //log all form data
         alert(this.state.brand+"=="+this.state.priceRange);
         var nPriceMin = 0;
         var nPriceMax = this.state.priceRange;
         var brand = this.state.brand;
         return false;
         //fetch request to get filtered data , TODO //call the slug api instead
         fetch('http://localhost/gsmarena-API/api/?action=brands&sMakers='+brand+'&nPriceMin='+nPriceMin+'&nPriceMax='+nPriceMax)
           .then(response => response.json())
           .then(res => this.setState({ 
             filteredBrands:res.data ,
             showBrand:true
            }));
       // this.setState({showBrand:true})
  }

  goToDetailsScreen(item){
    var itemSlug = item.href;
    fetch('http://localhost/gsmarena-API/api/?slug='+itemSlug)
           .then(response => response.json())
           .then(res => this.setState({ 
             advDetails:res.data ,
    }));
    this.props.navigation.navigate('DetailScreen',{Details:this.state.advDetails});
  }

  renderPickerItems(){
    if(this.state.brands.length > 0){
      this.state.brands.map(function(brand,i){
        var brandName = brand.title;
        var brandSlug = brand.href;
        var brandId = brandSlug.split("-")[1];

        return (
          <Picker.Item style={{fontFamily: 'SourceSansPro-Regular'}} 
          label="{brandName}" 
          value="{brandId}" key={i} />
        );
      });
    }
  }

  _renderItem = ({ item }) => {
      return (
       <TouchableHighlight style={[styles.button, this.setBgColor()]} onPress={()=>this.goToDetailsScreen(item)}>
         <View style={styles.item}>
           <View style={styles.avatar}>
             <Text style={styles.letter}>{item.title.slice(0, 1).toUpperCase()}</Text>
           </View>
           <View style={styles.details}>
             <Text style={styles.name}>{item.title}</Text>
             <Text style={styles.number}>{item.count}</Text>
           </View>
         </View>
       </TouchableHighlight>
      );
  }
  _ItemSeparator = () => <View style={styles.separator}></View>;

  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Picker selectedValue={this.state.brand}
        mode="dropdown" 
        onValueChange = {(brandId) => this.setState({
          brand:brandId
          })}>
        {this.renderPickerItems()}
          {/* {this.state.brands.map(function(brand,i){
            var brandName = brand.title;
            var brandHref = brand.href;
            let result = brandHref.match(/\d+/g).map(n => parseInt(n));
            var brandId = result[0];
            return (
              <Picker.Item style={{fontFamily: 'SourceSansPro-Regular'}} 
              label="{brandName}" 
              value="{brandId}" key={i} />
            );
          }, this)
          } */}
        </Picker>

        <Slider
          value={this.state.priceRange}
          minimumValue={0}
          maximumValues={400}
          onValueChange={e => {
        this.setState(() => {
          return { priceRange: e }
        })
      }}
      onSlidingComplete={e => {
        this.setState(() => {
          return { priceRange: e }
        })
      }} 
      />
        <Text>{this.state.priceRange}</Text>
        <Button
          raised
          icon={{name: 'check'}}
          title='SUBMIT'
          onPress={() => this.handleButtonPress()} />

        {this.state.showBrand == true ? <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.getStartedContainer}>
              <Text style={styles.getStartedText}> Brands </Text>
            </View>

            <FlatList
              data={this.state.filteredBrands}
              keyExtractor={(item, i) => String(i)}
              renderItem={this._renderItem}
              ItemSeparatorComponent={this._ItemSeparator}
            />
          </ScrollView>: null
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    marginBottom: 15,
    padding: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666666',
    fontSize: 18
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    margin: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  number: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, .08)',
  }
});
