class Position < ApplicationRecord
  has_many :assignments
  has_many :preferences
  has_many :teaches

end
