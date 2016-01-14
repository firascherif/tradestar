

public enum EventbusAddress {

	NewPlayer, 
	
	PlayerUpdates, 
	
	ConnectPlayer, 
	
	CreateTable, 
	
	JoinTable, 
	
	ExitTable, 
	
	TableList,

	DestroyTable, 
	
	Logout, 
	
	PlayerInfo, 
	
	PublishPlayerPresence,
	
	GetOnlinePlayers,
	
	GetLeaderBoard,
	
	GlobalLeaderBoardUpdate,
	
	LevelUp,
	
	ChargePayment,
	
	GetTimeRemainingForTopup,
	
	PerformBalanceTopup,
	
	GetLatestCurrencyQuote,
	
	GetPastCurrencyQuotes,
	
	GetAllCurrencyPairs,
	
	// Client side 
	OnlinePlayers,
	
	LeaderBoardUpdateJS;
}
