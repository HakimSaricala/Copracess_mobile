/* eslint-disable prettier/prettier */
import { MaterialIcons } from '@expo/vector-icons';
import { ListItem, Text, Avatar, Button } from '@rneui/themed';
import React from 'react';
import { View, FlatList } from 'react-native';

import { QueueItem } from '~/types/milldashboard';

export interface QueueSectionProps {
  title: string;
  seeAllText?: string;
  data: QueueItem[];
  onSeeAllPress?: () => void;
  containerClassName?: string;
  emptyStateText?: string;
  showAvatar?: boolean;
  onItemPress?: (item: QueueItem) => void;
}
const QueueCard = ({
  item,
  showAvatar,
  onPress,
}: {
  item: any;
  showAvatar?: boolean;
  onPress?: (item: any) => void;
}) => (
  <ListItem
    onPress={() => onPress?.(item)}
    containerStyle={{
      backgroundColor: 'white',
      borderRadius: 8,
      marginBottom: 12,
    }}>
    {showAvatar && (
      <Avatar
        rounded
        icon={{
          name: (item.icon as keyof typeof MaterialIcons.glyphMap) || 'person',
          type: 'material',
          color: 'white',
        }}
        containerStyle={{
          backgroundColor: '#59A60E',
        }}
      />
    )}
    <ListItem.Content>
      <ListItem.Title style={{ fontFamily: 'Poppins-Medium' }}>{item.owner}</ListItem.Title>
      <ListItem.Subtitle style={{ color: '#91919F' }}>{item.plateNumber}</ListItem.Subtitle>
    </ListItem.Content>
    <Button
      title={item.status}
      type="clear"
      containerStyle={{
        backgroundColor:
          item.statusColor === 'secondary' ? 'rgba(255,149,0,0.2)' : 'rgba(89,166,14,0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
      }}
      titleStyle={{
        color: item.statusColor === 'secondary' ? '#FF9500' : '#59A60E',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
      }}
    />
  </ListItem>
);

const QueueSection: React.FC<QueueSectionProps> = ({
  title,
  seeAllText = 'See All',
  data,
  onSeeAllPress,
  containerClassName = '',
  emptyStateText = 'No items found',
  showAvatar = true,
  onItemPress,
}) => {
  const renderHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
      }}>
      <Text h4 style={{ fontFamily: 'Poppins-Bold' }}>
        {title}
      </Text>
      {onSeeAllPress && (
        <Button
          title={seeAllText}
          type="clear"
          titleStyle={{
            color: '#59A60E',
            fontFamily: 'Poppins-Medium',
          }}
          onPress={onSeeAllPress}
        />
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={{ alignItems: 'center', paddingVertical: 32 }}>
      <Text style={{ color: '#91919F', fontSize: 14 }}>{emptyStateText}</Text>
    </View>
  );

  return (
    <View style={{ marginTop: 16 }} className={containerClassName}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <QueueCard item={item} showAvatar={showAvatar} onPress={onItemPress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default QueueSection;
