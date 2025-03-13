import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {books, qrscan, plus} from '../../assets/icons';
import {fetchDashboardData} from '../../redux/features/dashboardSlice';
import {AppDispatch, RootState} from '../../redux/store';

const StatisticCard = ({title, value, color}: any) => (
  <View style={[styles.statisticCard, {backgroundColor: color}]}>
    <Text style={styles.statisticValue}>{value}</Text>
    <Text style={styles.statisticTitle}>{title}</Text>
  </View>
);

const QuickActionButton = ({icon, title, onPress}: any) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
    <Image source={icon} style={styles.quickActionIcon} />
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const RecentActivityCard = ({title, subtitle, date}: any) => (
  <View style={styles.activityCard}>
    <View style={styles.activityInfo}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activitySubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.activityDate}>{date}</Text>
  </View>
);

const LibrarianDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const {statistics, recentBorrows, isLoading} = useSelector(
    (state: RootState) => state.dashboard,
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await dispatch(fetchDashboardData()).unwrap();
    } catch (error: any) {
      Alert.alert(
        'Hata',
        error?.message || 'Veriler yüklenirken bir hata oluştu',
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'borrowed':
        return 'ödünç aldı';
      case 'returned':
        return 'iade etti';
      case 'overdue':
        return 'geciktirdi';
      default:
        return status;
    }
  };

  const statisticsData = [
    {
      title: 'Toplam Kitap',
      value: statistics?.totalBooks?.toString() || '0',
      color: '#12192117',
    },
    {
      title: 'Ödünçte',
      value: statistics?.borrowedBooks?.toString() || '0',
      color: '#12192117',
    },
    {
      title: 'Süresi Yaklaşan',
      value: statistics?.dueBooks?.toString() || '0',
      color: '#12192117',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kütüphane Yönetimi</Text>
        <Text style={styles.headerSubtitle}>Hoş geldiniz 👋</Text>
      </View>

      <View style={styles.statisticsContainer}>
        {statisticsData.map((stat, index) => (
          <StatisticCard key={index} {...stat} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
      <View style={styles.quickActionsContainer}>
        <QuickActionButton
          icon={plus}
          title="Kitap Ekle"
          onPress={() => navigation.navigate('BookManagement' as never)}
        />
        <QuickActionButton
          icon={qrscan}
          title="QR Tara"
          onPress={() => navigation.navigate('LoanManagement' as never)}
        />
        <QuickActionButton
          icon={books}
          title="Kitapları Listele"
          onPress={() => navigation.navigate('BookManagement' as never)}
        />
      </View>

      <Text style={styles.sectionTitle}>Son İşlemler</Text>
      <View style={styles.activitiesContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#121921" />
        ) : recentBorrows && recentBorrows.length > 0 ? (
          recentBorrows.map(borrow =>
            borrow && borrow.book && borrow.user ? (
              <RecentActivityCard
                key={borrow._id}
                title={borrow.book.title}
                subtitle={`${borrow.user.name} ${getStatusText(borrow.status)}`}
                date={formatDate(borrow.borrowDate)}
              />
            ) : null,
          )
        ) : (
          <Text style={styles.emptyText}>Henüz işlem bulunmuyor</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#121921',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statisticCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statisticValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A28D4F',
  },
  statisticTitle: {
    fontSize: 12,
    color: '#A28D4F',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121921',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quickActionIcon: {
    width: 24,
    height: 24,
    tintColor: '#121921',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activitiesContainer: {
    padding: 20,
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121921',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default LibrarianDashboardScreen;
