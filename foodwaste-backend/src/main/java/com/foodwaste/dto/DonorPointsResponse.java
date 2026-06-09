package com.foodwaste.dto;

import com.foodwaste.model.PointsLedger;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorPointsResponse {
    private Integer points;
    private String badge;
    private List<PointsLedger> history;
}
