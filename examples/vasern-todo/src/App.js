/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SectionList,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import Spacer from 'react-native-spacer';
import styles from './styles';

import { Todos } from './database';

const KeyboardMargin = Platform.OS == "android" ? 25 : 0;

type Props = {};
export default class App extends Component<Props> {

  state = { 
    todos: [],
    selected: false,
    selectedItem: undefined,
    enableAction: false
  };

  name: string;

  constructor(props) {
    super(props);

    this._setItems = this._setItems.bind(this);
    this._insertTodo = this._insertTodo.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._renderHeaderItem = this._renderHeaderItem.bind(this);
    this._toggleTodoStatus = this._toggleTodoStatus.bind(this);
    this._setParentTodo = this._setParentTodo.bind(this);
    this._toggleAction = this._toggleAction.bind(this);
  }

  componentDidMount() {
      /**
       * onLoaded is used to rehydrate the data from the Stored Instance.
       * Without this method already stored data would not be able to access.
       * Having this in the Mount method is going to be better so that other methods in the components doesn't have to use onLoaded.
       */
    Todos.onLoaded(() => this._setItems());

      /**
       * onChange is used to perform actions whenever DB is changed or updated.
       */
    Todos.onChange(() => this._setItems());
  }

  _setItems() {

    // get all items does with undefined "parent"
    let todos = Todos.filter(item => !item.parent && !item.parent_id ).data();

    // find children for each of "parent"
    todos.forEach((item, i ) => {

      todos[i].data = Todos.filter(child => {
        return child.parent_id ? child.parent_id == item.id
          : child.parent ? child.parent.id == item.id : false;
        
      }).data();

    })

    this.setState({ todos });
  }

  _insertTodo() {

    if (this.name && this.name.length) {

      Todos.insert({
        name: this.name,
        completed: false,
        parent: this.state.selectedItem
      })

      this.name = "";
      this.nameTextInput.clear();
    }
    
    if (this.state.selectedItem) {
      this.setState({ selectedItem: undefined });
    }
  }

  _removeTodo(id, removeChildren = false) {

    if (id && id.length) {

      // .perform is optimized for batch queries (insert/update/delete)
      Todos.perform(db => {

        // Remove item
        db.remove(id);

        if (removeChildren) {
          // Get and remove children
          Todos.filter({ parent_id: id }).data()
            .forEach(child => db.remove(child));
        }

      })
    }
  }

  _toggleTodoStatus(item) {
    if (item && item.id) {
      Todos.update(item, { completed: !item.completed })
    }
  }

  _toggleAction() {
    this.setState({ enableAction: !this.state.enableAction });
  }

  _renderHeaderItem({ section }) {
    return this._renderItem({ item: section, isParent: true });
  }

  _renderItem({ item, isParent }) {
    
    return <View style={[styles.itemContainer,
      isParent ? styles.itemContainer_Parent : null
    ]}>

      {/** Complete icon */}
      <TouchableOpacity onPress={() => this._toggleTodoStatus(item)}>
        { item.completed ? 
          <View style={styles.completeIcon} /> : 
          <View style={styles.incompleteIcon} />
        }
      </TouchableOpacity>

      {/** Todo name */}
      <TouchableOpacity style={styles.itemTextContainer} onPress={() => this._setParentTodo(item)}>
        <Text style={item.completed ? styles.itemCompleted : styles.item}>{item.name}</Text>
      </TouchableOpacity>

      {/** Actions */}
      { !this.state.enableAction ? null : 
        <TouchableOpacity onPress={() => this._removeTodo(item.id, isParent)} >
          <View style={{ padding: 5 }}>
            <Text style={styles.textNegative}>Remove</Text>
          </View>
        </TouchableOpacity>
        }
    </View>
  }

  _setParentTodo(selectedItem) {
    let newState = {};

    if (!this.state.selectedItem || this.state.selectedItem.id != selectedItem.id ) {
      newState.selectedItem = selectedItem;
    } else {
      newState.selectedItem = undefined;
    }

    this.setState(newState);
  }

  render() {
    return (
      
      <SafeAreaView style={styles.container}>

        <View style={[styles.flexRow, styles.titleContainer]}>

          <Text style={styles.title}>Todo list</Text>
          
          { !this.state.todos.length ? null :
              <TouchableOpacity onPress={this._toggleAction}>
                <Text style={styles.textBtn_lg}>Action</Text>
              </TouchableOpacity>
          }
        </View>
        
        <SectionList 
          style={styles.list}
          sections={this.state.todos}
          renderItem={this._renderItem}
          keyExtractor={item => item.id}
          renderSectionHeader={this._renderHeaderItem}
          stickySectionHeadersEnabled={false}
          contentInset={{ bottom: 30 }}
          ListEmptyComponent={<Text style={styles.note}>List Empty</Text>}
        />
        
        {/* Add task views */}
        <Spacer spaceMargin={KeyboardMargin} enabled>
        <View style={styles.bottomPanel}>

          {/** Subitem message */}
          { !this.state.selectedItem ? null :
            <View style={styles.flexRow}>
              <Text style={styles.panelNote}>Adding sub item for "{this.state.selectedItem.name}"</Text>
            </View>
          }
          
          {/** Add todo textbox */}
            <View style={styles.flexRow}>
              <TextInput 
                style={styles.textInput}
                ref={ref => this.nameTextInput = ref}
                placeholder="Add a new todo" 
                onChangeText={text => this.name = text}
                onSubmitEditing={this._insertTodo}
              />
              <TouchableOpacity style={styles.textBtnWrapper} onPress={this._insertTodo}>
                <Text style={styles.textBtn}>+</Text>
              </TouchableOpacity>
            </View>
        </View>

        </Spacer>
      </SafeAreaView>
    );
  }
}
