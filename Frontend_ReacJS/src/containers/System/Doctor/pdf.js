import React from 'react';
import ModalPrescription from './ModalPrescription';
import {
    BlobProvider,
    Document,
    Page,
    Text,
    View,
    Image,
    Link,
    StyleSheet
  } from "@react-pdf/renderer";
import logo from '../../../assets/prescription-medical.jpg';

const styles = StyleSheet.create({
    page: {
      flexDirection: "column"
    },
    image: {
      width: "50%",
      padding: 10
    },
    centerImage: {
      alignItems: "center",
      flexGrow: 1
    },
    text: {
      width: "100%",
      backgroundColor: "#f0f0f0",
      paddingHorizontal: 50,
      paddingVertical: 30,
      color: "#212121",
      textTransform: 'uppercase',
      fontSize: 24,
    },

    container: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: '#112131',
      borderBottomStyle: 'solid',
      alignItems: 'stretch',
    },
    detailColumn: {
      flexDirection: 'column',
      flexGrow: 9,
      textTransform: 'uppercase',
    },
    linkColumn: {
      flexDirection: 'column',
      flexGrow: 2,
      alignSelf: 'flex-end',
      justifySelf: 'flex-end',
    },
    name: {
      fontSize: 24,
      fontFamily: 'Lato Bold',
    },
    subtitle: {
      fontSize: 10,
      justifySelf: 'flex-end',
      fontFamily: 'Lato',
    },
    link: {
      fontFamily: 'Lato',
      fontSize: 10,
      color: 'black',
      textDecoration: 'none',
      alignSelf: 'flex-end',
      justifySelf: 'flex-end',
    },

  });
const PDFFile = () => {
    return (
        <Document>
    <Page style={styles.page} size="A4">
    <View style={styles.container}>
    <View style={styles.detailColumn}>
      <Text style={styles.name}>Luke Skywalker</Text>
      <Text style={styles.subtitle}>Jedi Master</Text>
    </View>
    <View style={styles.linkColumn}>
      <Link href="mailto:luke@theforce.com" style={styles.link}>
        luke@theforce.com
      </Link>
    </View>
  </View>

    </Page>
  </Document>
    )
}


export default PDFFile;