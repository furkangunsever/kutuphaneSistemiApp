// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   StatusBar,
// } from 'react-native';
// import {useDispatch} from 'react-redux';
// import {setUserRole} from '../../redux/features/authSlice';
// import {izmirim_resized_2} from '../../assets/images';
// const RoleSelectionScreen = ({navigation}: any) => {
//   const dispatch = useDispatch();

//   const handleRoleSelection = (role: 'librarian' | 'user') => {
//     dispatch(setUserRole(role));
//     navigation.navigate('Login');
//   };

//   return (
//     <ImageBackground source={izmirim_resized_2} style={styles.backgroundImage}>
//       <StatusBar
//         barStyle="light-content"
//         translucent
//         backgroundColor="transparent"
//       />
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.title}>Kütüphane Sistemi</Text>
//             <Text style={styles.subtitle}>Hoş Geldiniz</Text>
//           </View>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={styles.roleButton}
//               onPress={() => handleRoleSelection('librarian')}>
//               <Text style={styles.buttonText}>Kütüphaneci Girişi</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.roleButton_2}
//               onPress={() => handleRoleSelection('user')}>
//               <Text style={styles.buttonText}>Kullanıcı Girişi</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   titleContainer: {
//     width: '100%',
//     marginLeft: 10,
//     height: '50%',
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#fff',
//   },
//   subtitle: {
//     fontSize: 24,
//     marginBottom: 50,
//     color: '#fff',
//     width: '90%',
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     width: '100%',
//     maxWidth: 400,
//     gap: 20,
//   },
//   roleButton: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     width: '100%',
//   },
//   roleButton_2: {
//     backgroundColor: '#A28D4F',
//     padding: 20,
//     borderRadius: 12,
//     width: '100%',
//   },
//   buttonText: {
//     color: 'black',
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default RoleSelectionScreen;
