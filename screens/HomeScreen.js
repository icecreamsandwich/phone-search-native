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
      brandName: ""
      priceRange: []
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
      .then(data => this.setState({ brands:data }));
      this.setState({isLoading:false})
  }

  handleInputChange(event) {
       this.setState({ [event.target.name]: event.target.value});
  }

  handleButtonPress() {
         //log all form data
         alert(this.state.brand+"=="+this.state.priceRange);
         var nPriceMin = priceRange[0];
         var nPriceMax = priceRange[1];
         return false;
         //fetch request to get filtered data
         fetch('http://localhost/gsmarena-API/api/?action=brands&sMakers='+brand+'&nPriceMin='+nPriceMin+'&nPriceMax='+nPriceMax)
           .then(response => response.json())
           .then(data => this.setState({ filteredBrands:data }));
        this.setState({showBrand:true})
  }

  goToDetailsScreen(item){
    this.props.navigation.navigate('DetailScreen',{Details:item});
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

        <Picker selectedValue = {} onValueChange = {(brand) => this.setState({brandId})}>
          { this.state.brands.map(function(brand,i){
            var brandHref = brand.href;
            var brandId = parseInt(brandHref, 10);

            return (
              <Picker.Item label="{brand}" value="{brandId}" key={i} />
            );
          }, this)}

        </Picker>

        <Slider
          value={this.state.value}
          minimumValue={0}
          maximumValues={400}
          onValueChange={(priceRange) => this.setState({priceRange})} />

        <Button
          raised
          icon={{name: 'check'}}
          title='SUBMIT'
          onPress={() => this.handleButtonPress()} />

        {if(this.state.showBrand){
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.getStartedContainer}>
              <Text style={styles.getStartedText}> Brands </Text>
            </View>

            <FlatList
              data={this.state.filteredBrands}
              keyExtractor={(item, i) => String(i)}
              renderItem={this._renderItem}
              ItemSeparatorComponent={this._ItemSeparator}
            />
          </ScrollView>
        }}

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
