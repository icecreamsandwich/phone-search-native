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
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import RangeSlider from 'react-native-range-slider';

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      brandName: ""
      priceRange: ""
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
      .then(data => this.setState({ brands:data.title }));
      this.setState({isLoading:false})
  }

  handleInputChange(event) {
       this.setState({ [event.target.name]: event.target.value});
  }

  handleButtonPress() {
         //log all form data
         alert(this.state.brand+"=="+this.state.priceRange);
         return false;
         //fetch request to get filtered data
         fetch('http://localhost/gsmarena-API/api/?action=brands&brandName='+brand+'&nPriceMin='+100+'&nPriceMax='+4000)
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

        <Picker selectedValue = {} onValueChange = {(brand) => this.setState({brand})}>
          { this.state.brands.map(function(brand,i){
            return (
              <Picker.Item label = "{brand}" value = "{brand}" key={i} />
            );
          }, this)}

        </Picker>

        <RangeSlider
          minValue={0}
          maxValue={50000}
          tintColor={'#da0f22'}
          handleBorderWidth={1}
          handleBorderColor="#454d55"
          selectedMinimum={0}
          selectedMaximum={25000}
          style={{ flex: 1, height: 70, padding: 10, backgroundColor: '#ddd' }}
          onChange={ (data)=>{ this.setState({priceRange})} }
        />

        <Button
          raised
          icon={{name: 'check'}}
          title='SUBMIT'
          onPress={() => this.handleButtonPress()} />
      </View>
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

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
